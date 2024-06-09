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
import { ProjectFormControlType } from "@/app/settings/projects/page";

type ProjectDescriptionFormProps = {
  control: ProjectFormControlType;
  name: `projects.${number}.description`;
};

export function ProjectDescriptionForm({
  control,
  name,
}: ProjectDescriptionFormProps) {
  const { fields, append, remove } = useFieldArray({
    name,
    control,
  });

  return (
    <div className="mt-2">
      <FormLabel>Project description</FormLabel>
      <div>
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 items-start mt-2">
            <FormField
              control={control}
              name={`${name}.${index}.body`}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input {...field} />
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
              type="button"
            >
              <Trash2 />
            </Button>
          </div>
        ))}
        <Button
          onClick={() => append({ body: "" })}
          className="mt-2"
          type="button"
        >
          Add Description
        </Button>
      </div>
    </div>
  );
}
