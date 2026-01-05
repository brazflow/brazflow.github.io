import { Link } from 'react-router-dom';

export default function BrandLogo(){
  return (
    <Link to="/" className="flex gap-3 items-center bg-gradient-to-r from-[#5372F0]/10 to-[#215BBF]/5 p-2 rounded-md border border-[#5372F0]/20" role="img" aria-label="BrazFlow logo">
      <div className="text-[34px] drop-shadow-md transform -translate-y-[2px]">🌊</div>
      <div className="brand-text">
        <div className="font-bold text-xl bg-gradient-to-r from-[#ffd166] to-[#ef476f] bg-clip-text text-transparent">BrazFlow</div>
        <div className="text-xs text-brazflow-muted">Water Availability</div>
      </div>
    </Link>
  )
}

