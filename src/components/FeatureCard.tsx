interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  gradientColor?: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
  gradientColor,
}: FeatureCardProps) {
  return (
    <div className="group p-8 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl relative overflow-hidden">
      {gradientColor && (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradientColor} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
        ></div>
      )}
      <div className="relative">
        <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-2xl font-bold mb-3 text-slate-900">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

