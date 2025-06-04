import "./inspiration-gallery.css"

const INSPIRATION_IMAGES = [
  "https://raphael.app/_next/image?url=%2Fexample-images%2F15.webp&w=828&q=75",
  "https://raphael.app/_next/image?url=%2Fexample-images%2F3.webp&w=828&q=75",
  "https://raphael.app/_next/image?url=%2Fexample-images%2F9.webp&w=828&q=75",
  "https://raphael.app/_next/image?url=%2Fexample-images%2F16.webp&w=828&q=75",
  "https://raphael.app/_next/image?url=%2Fexample-images%2F4.webp&w=828&q=75",
  "https://raphael.app/_next/image?url=%2Fexample-images%2F7.webp&w=828&q=75",
  "https://raphael.app/_next/image?url=%2Fexample-images%2F13.webp&w=828&q=75",
  "https://raphael.app/_next/image?url=%2Fexample-images%2F2.webp&w=828&q=75",
  "https://raphael.app/_next/image?url=%2Fexample-images%2F6.webp&w=828&q=75",
  "https://raphael.app/_next/image?url=%2Fexample-images%2F10.webp&w=828&q=75",
  "https://raphael.app/_next/image?url=%2Fexample-images%2F14.webp&w=828&q=75",
  "https://raphael.app/_next/image?url=%2Fexample-images%2F5.webp&w=828&q=75",
  "https://raphael.app/_next/image?url=%2Fexample-images%2F8.webp&w=828&q=75",
  "https://raphael.app/_next/image?url=%2Fexample-images%2F11.webp&w=828&q=75",
  "https://raphael.app/_next/image?url=%2Fexample-images%2F1.webp&w=828&q=75",
]

export default function InspirationGallery() {
  return (
    <div className="inspiration-gallery">
      <div className="gallery-header">
        <h2>Get Inspired</h2>
        <p>Browse examples created by our community</p>
      </div>
      <div className="gallery-grid">
        {INSPIRATION_IMAGES.map((image, index) => (
          <div key={index} className="gallery-item">
            <img src={image || "/placeholder.svg"} alt={`Inspiration ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  )
}
