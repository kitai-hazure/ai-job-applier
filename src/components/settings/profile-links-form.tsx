import { useFieldArray } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { Input } from "../ui/input";
import { ProfileFormControlType } from "@/app/settings/profile/page";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type ProfileLinksFormProps = {
  control: ProfileFormControlType;
  name: "links";
};

export function ProfileLinksForm({ control, name }: ProfileLinksFormProps) {
  const { fields, append, remove } = useFieldArray({
    name,
    control,
  });

  return (
    <div className="mt-2">
      <FormLabel>Your social profile links (Github, Portfolio, etc.)</FormLabel>
      <div>
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 items-start mt-2">
            <FormField
              control={control}
              name={`${name}.${index}.name`}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue>{field.value}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Github">GitHub</SelectItem>
                    <SelectItem value="Linkedin">Linkedin</SelectItem>
                    <SelectItem value="Portfolio">Portfolio</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FormField
              control={control}
              name={`${name}.${index}.url`}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://github.com/username"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => remove(index)}
              className="w-12"
            >
              <Trash2 />
            </Button>
          </div>
        ))}
        <Button
          onClick={() => append({ name: "Other", url: "" })}
          className="mt-2"
          type="button"
        >
          Add Link
        </Button>
      </div>
    </div>
  );
}
