import { Card, CardContent } from "@/components/ui/card";

interface CourseCardProps {
  title: string;
  description: string;
  image: string;
  duration: string;
  level: string;
  price?: string;
}

const CourseCard = ({ title, description, image, duration, level, price }: CourseCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
      <div className="aspect-video overflow-hidden relative">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-3">
          {description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium text-sm">
            {duration}
          </span>
          <span className="bg-secondary/80 text-secondary-foreground px-3 py-1 rounded-full font-medium text-sm">
            {level}
          </span>
          {price && (
            <span className="bg-accent/10 text-accent-foreground px-3 py-1 rounded-full font-bold text-sm">
              {price} دج
            </span>
          )}
        </div>
        <div className="pt-2 border-t border-border">
          <button className="w-full bg-primary/5 hover:bg-primary hover:text-primary-foreground text-primary font-medium py-2 px-4 rounded-lg transition-all duration-200 hover:scale-105">
            التسجيل في الدورة
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;