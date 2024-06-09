import { ProjectFormControlType } from "@/app/settings/projects/page";
import { useFieldArray } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Trash2 } from "lucide-react";

type ProjectLinksFormProps = {
  control: ProjectFormControlType;
  name: `projects.${number}.links`;
};

export function ProjectLinksForm({ control, name }: ProjectLinksFormProps) {
  const { fields, append, remove } = useFieldArray({
    name,
    control,
  });

  return (
    <div className="mt-2">
      <FormLabel>Links</FormLabel>
      <div>
        {fields.map((field, index) => (
          <div key={field.id}>
            <FormItem className="flex gap-2 items-start">
              <FormField
                control={control}
                name={`${name}.${index}.name`}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="mt-2 w-[150px]">
                      <SelectValue>{field.value}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Github">Github</SelectItem>
                      <SelectItem value="Youtube">Youtube</SelectItem>
                      <SelectItem value="Preview">Preview</SelectItem>
                      <SelectItem value="PlayStore">PlayStore</SelectItem>
                      <SelectItem value="AppStore">AppStore</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <FormField
                control={control}
                name={`${name}.${index}.url`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} className="https://example.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                variant="outline"
                size="icon"
                className="w-16"
                onClick={() => remove(index)}
                type="button"
              >
                <Trash2 />
              </Button>
            </FormItem>
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
