import Link from "next/link";

const trainers = [
  {
    name: "Ramesh Kumar",
    package: "10 Sessions",
    amount: 5500,
  },
  {
    name: "Suresh Yadav",
    package: "15 Sessions",
    amount: 7500,
  },
];

export default function TrainersPage() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Driving Trainers</h1>

      {trainers.map((t, i) => (
        <div
          key={i}
          style={{
            border: "1px solid #ddd",
            padding: 16,
            marginBottom: 12,
            borderRadius: 6,
          }}
        >
          <h3>{t.name}</h3>
          <p>Package: {t.package}</p>
          <p>Amount: ₹{t.amount}</p>

          <Link
            href={`/book?trainer=${encodeURIComponent(
              t.name
            )}&package=${encodeURIComponent(
              t.package
            )}&amount=${t.amount}`}
          >
            <button>Book Now</button>
          </Link>
        </div>
      ))}
    </div>
  );
}
