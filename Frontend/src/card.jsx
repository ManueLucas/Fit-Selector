export default function Card({ imageSrc, category }) {
    return (
        <div className="card">
            <img src={imageSrc} alt={category} className="card-image" />
            <p className="card-category">{category}</p>
        </div>
    );
}


