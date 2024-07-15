import { useFieldArray } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon, Trash2 } from "lucide-react";
import { Input } from "../ui/input";
import { ProfileFormControlType } from "@/app/settings/profile/page";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type ProfileLinksFormProps = {
  control: ProfileFormControlType;
  name: "education";
};

export function ProfileEducationForm({ control, name }: ProfileLinksFormProps) {
  const { fields, append, remove } = useFieldArray({
    name,
    control,
  });

  return (
    <div className="mt-2">
      <FormLabel>Experience</FormLabel>
      <div>
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 items-start mt-2">
            <FormField
              control={control}
              name={`${name}.${index}.school`}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`${name}.${index}.degree`}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* TODO -> LATER CONVERT THIS TO A DROPDOWN */}
            <FormField
              control={control}
              name={`${name}.${index}.field_of_study`}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`${name}.${index}.start_date`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.name && "text-muted-foreground"
                            )}
                          >
                            {field.name ? (
                              format(field.name, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          //   @ts-ignore
                          selected={field.name}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`${name}.${index}.end_date`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.name && "text-muted-foreground"
                            )}
                          >
                            {field.name ? (
                              format(field.name, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          //   @ts-ignore
                          selected={field.name}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
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
          onClick={() =>
            append({
              school: "",
              degree: "",
              field_of_study: "",
              start_date: new Date(),
              end_date: new Date(),
            })
          }
          className="mt-2"
          type="button"
        >
          Add Education
        </Button>
      </div>
    </div>
  );
}
