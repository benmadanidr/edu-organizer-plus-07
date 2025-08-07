import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function AddStudentDialog() {
  const handleAddStudent = () => {
    window.open("https://preview--edu-organizer-plus-99.lovable.app/register", "_blank");
  };

  return (
    <Button onClick={handleAddStudent}>
      <Plus className="w-4 h-4 mr-2" />
      إضافة طالب جديد
    </Button>
  );
}