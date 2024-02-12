"use client";
import { useCreateAlbum } from "@/app/api/resolver/albumResolver";
import { usePostImage } from "@/app/api/resolver/imageResolver";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useDecodedToken } from "@/hooks/useDecodedToken";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import LoadingOval from "../common/loader/LoadingOval";

export default function FormCreateAlbum() {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const { mutateAsync: createAlbum } = useCreateAlbum();
  const { user_id } = useDecodedToken();
  const [openDialog, setOpenDialog] = useState(false);

  const formSchema = z.object({
    album_name: z.string().min(2).max(50),
    description: z.string().min(2),
    tags: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      album_name: "",
      description: "",
      tags: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const data = {
        ...values,
        owner_id: user_id,
        data_image: selectedFile,
      };

      await createAlbum(data);

      toast({
        title: "Yeah, success create your album!",
        description: "Get ready to have your album seen by many people",
      });
      setOpenDialog(false);
    } catch (error) {
      console.log("error:", error);
      if (error.response) {
        toast({
          variant: "destructive",
          title: `${error.response?.data?.message || "Failed to create album"}`,
        });
      }
    }
  }

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    setSelectedFile(e.target.files[0]);
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Drawer open={openDialog} onClose={() => setOpenDialog(false)}>
      <DrawerTrigger>
        <Button
          variant={"outline"}
          className="flex items-center gap-2"
          onClick={() => setOpenDialog(true)}
        >
          <Plus />
          <p className="hidden md:block">Create album</p>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh]">
        <div className="container py-10 overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedFile ? (
                  <div className="relative min-h-[50vh] md:min-h-screen max-h-screen border rounded-lg">
                    <div className="absolute bottom-3 right-3 z-10">
                      <FormField
                        control={form.control}
                        name="data_image"
                        render={({ field: { onChange, value, ...rest } }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                {...rest}
                                accept="image/*"
                                name="data_image"
                                type="file"
                                disabled={isSubmitting}
                                onChange={onSelectFile}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Image
                      src={preview}
                      alt="test"
                      fill={true}
                      quality={10}
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <FormField
                    control={form.control}
                    name="data_image"
                    render={({ field: { onChange, value, ...rest } }) => (
                      <FormItem>
                        <FormLabel>Album Cover</FormLabel>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Input
                              {...rest}
                              accept="image/*"
                              name="data_image"
                              type="file"
                              disabled={isSubmitting}
                              onChange={onSelectFile}
                            />
                          </FormControl>
                          <FormLabel className="bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md text-xs font-medium text-center py-1 px-3">
                            Choose Image
                          </FormLabel>
                        </div>
                        <FormDescription>
                          Album cover should describe the content of the album
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <div className="flex flex-col gap-2">
                  <FormField
                    control={form.control}
                    name="album_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Album Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="The Middle Ages"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Album Description</FormLabel>
                        <FormControl>
                          <Textarea disabled={isSubmitting} {...field} />
                        </FormControl>
                        <FormDescription>
                          An overview of the album you&apos;ll be creating
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Castle, Historical, England"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Separate tags with a comma. Ex: market, food
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex md:justify-end mt-6">
                    <Button
                      type="submit"
                      className="w-full md:w-fit flex items-center gap-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting && <LoadingOval />}
                      Create album
                    </Button>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-center text-xs text-muted-foreground">
                  The title and tags you give to this album will determine the
                  album search results
                </p>
              </div>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
