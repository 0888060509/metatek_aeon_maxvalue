import { Aperture } from 'lucide-react';

const Logo = ({ className }: { className?: string }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <Aperture className="h-8 w-8 text-primary" />
    <span className="text-2xl font-bold tracking-tighter text-foreground">
      MetaTek
    </span>
  </div>
);

export default Logo;
