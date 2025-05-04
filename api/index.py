
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from googlesearch import search
import requests
from bs4 import BeautifulSoup
import time
from typing import List, Optional
from nltk.sentiment import SentimentIntensityAnalyzer
import nltk
import re
from transformers import pipeline

# Download necessary NLTK data
try:
    nltk.data.find('vader_lexicon')
except LookupError:
    nltk.download('vader_lexicon')

app = FastAPI()

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize sentiment analyzer
sid = SentimentIntensityAnalyzer()

# Initialize summarizer
try:
    summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
except:
    # Fallback - set to None and will use extractive summarization instead
    summarizer = None


class SearchRequest(BaseModel):
    query: str
    max_results: int = 6
    content_length: int = 1000  # Maximum characters to extract per website


class WebsiteContent(BaseModel):
    url: str
    title: Optional[str]
    content: str
    sentiment: dict


class SearchResponse(BaseModel):
    query: str
    overall_sentiment: dict
    comprehensive_summary: str
    sources: List[str]
    detailed_results: Optional[List[WebsiteContent]]


def extract_content_from_url(url: str, max_length: int = 1000) -> dict:
    """
    Extract content from a URL using BeautifulSoup
    """
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')

        # Get the title
        title = soup.title.string if soup.title else "No title found"

        # Remove script, style, and navigational elements
        for element in soup(["script", "style", "header", "footer", "nav", "aside"]):
            element.extract()

        # Get text content from paragraphs and headings
        paragraphs = soup.find_all(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'article'])
        text = ' '.join([para.get_text().strip() for para in paragraphs])

        # Clean up text: remove extra whitespace and newlines
        text = re.sub(r'\s+', ' ', text).strip()

        # Truncate content if needed
        if len(text) > max_length:
            text = text[:max_length] + "..."

        # Analyze sentiment
        sentiment = sid.polarity_scores(text)

        return {
            "url": url,
            "title": title,
            "content": text,
            "sentiment": sentiment
        }
    except Exception as e:
        return {
            "url": url,
            "title": "Error fetching content",
            "content": f"Could not extract content: {str(e)}",
            "sentiment": {"neg": 0, "neu": 1, "pos": 0, "compound": 0}
        }


def get_search_results_with_content(query: str, num_results: int = 6, content_length: int = 1000):
    """
    Get search results using googlesearch-python and extract content from each URL
    """
    try:
        results = []
        for url in search(query, num_results=num_results * 2, advanced=False):  # Get extra results in case some fail
            # Add a small delay to avoid aggressive requests
            time.sleep(1)

            # Extract content from the URL
            content_data = extract_content_from_url(url, content_length)
            if content_data["content"] and len(
                    content_data["content"]) > 50:  # Only include results with substantial content
                results.append(content_data)

            if len(results) >= num_results:
                break

        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching search results: {str(e)}")


def generate_comprehensive_summary(query: str, results: List[dict]) -> str:
    """
    Generate a comprehensive summary that combines information from all search results
    in a coherent, well-structured format
    """
    if not results:
        return f"No information found for query: {query}"

    # Combine all content, but keep track of sources for key information
    all_text = "\n\n".join([f"{result['title']}\n{result['content']}" for result in results])

    # Use transformer-based summarization if available
    if summarizer and len(all_text) > 200:
        try:
            # Split into chunks if text is too long for the model
            max_chunk_length = 1024
            chunks = [all_text[i:i + max_chunk_length] for i in range(0, len(all_text), max_chunk_length)]

            summaries = []
            for chunk in chunks[:3]:  # Limit to first 3 chunks to keep processing reasonable
                summary = summarizer(chunk, max_length=150, min_length=50, do_sample=False)
                summaries.append(summary[0]['summary_text'])

            combined_summary = " ".join(summaries)

            # Clean up the summary
            combined_summary = re.sub(r'\s+', ' ', combined_summary).strip()
            return combined_summary
        except Exception as e:
            # Fallback to extractive summarization if transformer fails
            print(f"Transformer summarization failed: {e}")

    # Extractive summarization as fallback
    # Extract key information about the query
    topic_sentences = []
    seen_info = set()

    # Extract title words for importance
    important_terms = set(query.lower().split())

    # Process each result
    for result in results:
        # Split content into sentences
        sentences = re.split(r'(?<=[.!?])\s+', result['content'])

        for sentence in sentences:
            # Skip short sentences
            if len(sentence) < 15:
                continue

            # Skip similar sentences we've already included
            sentence_key = re.sub(r'[^a-zA-Z0-9]', '', sentence.lower())
            if any(similar(sentence_key, key) for key in seen_info):
                continue

            # Check if sentence contains query terms or seems important
            contains_topic = any(term.lower() in sentence.lower() for term in important_terms)

            # Prioritize sentences with dates, facts, or definitions
            has_date = bool(re.search(r'\b\d{4}\b', sentence))  # Contains a year
            has_fact = bool(re.search(r'\bis\b|\bare\b|\bwas\b|\bwere\b', sentence))  # Contains common fact indicators

            if contains_topic or has_date or has_fact:
                topic_sentences.append(sentence)
                seen_info.add(sentence_key)

    # Limit to most relevant sentences
    if len(topic_sentences) > 12:
        topic_sentences = topic_sentences[:12]

    # Organize sentences into paragraphs
    paragraphs = []
    current_paragraph = []

    for sentence in topic_sentences:
        current_paragraph.append(sentence)
        if len(current_paragraph) >= 3:  # Group roughly 3 sentences per paragraph
            paragraphs.append(" ".join(current_paragraph))
            current_paragraph = []

    if current_paragraph:  # Add any remaining sentences
        paragraphs.append(" ".join(current_paragraph))

    # Join paragraphs with newlines
    final_summary = "\n\n".join(paragraphs)

    return final_summary


def similar(s1, s2):
    """Simple similarity check to avoid duplicate information"""
    # If one string is substantially contained within the other
    if len(s1) > 20 and len(s2) > 20:
        if s1 in s2 or s2 in s1:
            return True
    return False


@app.post("/search", response_model=SearchResponse)
async def search_analyze_and_summarize(search_request: SearchRequest):
    try:
        # Get search results with content
        results = get_search_results_with_content(
            search_request.query,
            search_request.max_results,
            search_request.content_length
        )

        if not results:
            return {
                "query": search_request.query,
                "overall_sentiment": {"neg": 0, "neu": 1, "pos": 0, "compound": 0},
                "comprehensive_summary": f"No information found for query: {search_request.query}",
                "sources": [],
                "detailed_results": []
            }

        # Calculate overall sentiment
        all_content = " ".join([result["content"] for result in results])
        overall_sentiment = sid.polarity_scores(all_content)

        # Generate comprehensive summary
        summary = generate_comprehensive_summary(search_request.query, results)

        return {
            "query": search_request.query,
            "overall_sentiment": overall_sentiment,
            "comprehensive_summary": summary,
            "sources": [result["url"] for result in results],
            "detailed_results": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8004)  # or use "0.0.0.0" to allow access from other devices on LAN