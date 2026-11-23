export default function StatCard({ icon: Icon, label, value, tone = "plum" }) {
  const tones = {
    plum: "bg-plum-900 text-gold-300",
    gold: "bg-gold-400 text-plum-950",
    emerald: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    rose: "bg-rose-100 text-rose-700",
  };
  return (
    <div className="card flex items-center gap-4 p-5">
      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${tones[tone]}`}>
        <Icon size={20} />
      </span>
      <div>
        <p className="font-display text-4xl font-bold leading-none text-plum-900">{value}</p>
        <p className="mt-1 text-sm text-muted">{label}</p>
      </div>
    </div>
  );
}
