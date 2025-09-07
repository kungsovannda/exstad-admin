import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FiPlus } from "react-icons/fi";
import React, {useState} from "react";


type DialogDemoProps = {
  onAddTopic: (title: string) => void;
};

export function DialogDemo({ onAddTopic }: DialogDemoProps) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    onAddTopic(title);
    setTitle("");
  };

  return (
<Dialog>
  <DialogTrigger asChild>
    <Button variant="default" className="flex items-center gap-2.5">
      <FiPlus className="text-[18px]" />
      <span className="text-[14px] font-bold">Add new topic</span>
    </Button>
  </DialogTrigger>

  <DialogContent className="sm:max-w-[425px] w-full p-6 rounded-lg shadow-lg mx-4 sm:mx-auto">
    <form onSubmit={handleSubmit}>
      <DialogHeader className="mb-6">
        <DialogTitle>Add new topic</DialogTitle>
        <DialogDescription>
          Fill in the title and subtitle.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4">
        <div className="grid gap-3">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter topic title..."
          />
        </div>
      </div>

      <DialogFooter className="mt-6">
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="submit">Add new</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>





  );
}
// export function AddDescriptionDialog() {
//   return (
//     <Dialog >
//       <form>
//         <DialogTrigger asChild>
//           <Button variant="default" className="flex items-center gap-2.5 ">
//             <FiPlus className="text-[18px]" />
//             <span className="text-[14px]  font-bold">Add new description</span>
//           </Button>
//         </DialogTrigger>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>Add new description</DialogTitle>
//             <DialogDescription>
//               Write a description for this section.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4">
//             <div className="grid gap-3">
//               <Label htmlFor="description-text">Description</Label>
//               <Input id="description-text" name="description" placeholder="Enter description..." />
//             </div>
//           </div>
//           <DialogFooter>
//             <DialogClose asChild>
//               <Button variant="outline">Cancel</Button>
//             </DialogClose>
//             <Button type="submit">Add description</Button>
//           </DialogFooter>
//         </DialogContent>
//       </form>
//     </Dialog>
//   );
// }