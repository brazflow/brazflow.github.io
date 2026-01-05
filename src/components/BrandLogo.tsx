
export default function BrandLogo(){
  return (
    <div className="brand-logo flex gap-3 items-center bg-gradient-to-r from-[#5372F0]/10 to-[#215BBF]/5 p-2 rounded-md border border-[#5372F0]/20" role="img" aria-label="BrazFlow logo">
      <div className="brand-icon text-3xl drop-shadow-md transform -translate-y-1">🌊</div>
      <div className="brand-text">
        <div className="brand-title font-extrabold">BrazFlow</div>
        <div className="brand-sub text-sm text-white/60">Water Availability</div>
      </div>
    </div>
  )
}
