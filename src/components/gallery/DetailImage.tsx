import { useDetailImage } from "@/app/api/resolver/imageResolver";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ButtonLike from "../button/ButtonLike";
import ButtonReportIssue from "../button/ButtonReportIssue";
import ButtonSaveToAlbum from "../button/ButtonSaveToAlbum";
import ButtonShare from "../button/ButtonShare";
import AvatarUserComponent from "../profile/AvatarUserComponent";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { DrawerContent } from "../ui/drawer";
import CommentSection from "./CommentSection";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function DetailImage({ imageId }) {
  const [imageLoading, setImageLoading] = useState(true);
  const { data: image, isLoading } = useDetailImage(imageId);
  const { push } = useRouter();

  if (isLoading) return <p>load...</p>;
  const detailImage = image.data.data;

  return (
    <DrawerContent className="h-[95vh]">
      <div className="p-4 md:p-16 gap-5 grid grid-cols-1 md:grid-cols-2 overflow-y-auto">
        <div>
          <Image
            src={detailImage.image_url}
            alt={`image ${detailImage.image_name} from owner ${detailImage.owner.username}`}
            priority
            width={detailImage.width}
            height={detailImage.height}
            onLoad={() => setImageLoading(false)}
            className={cn(
              "w-full rounded-lg object-cover object-center cursor-pointer",
              imageLoading
                ? "grayscale blur-2xl scale-110"
                : "grayscale-0 blur-0 scale-100"
            )}
          />
          <div className="flex flex-wrap gap-2 w-full mt-3">
            {detailImage?.tags.map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer"
                onClick={() => push(`/search/image?q=${tag}`)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <div className="space-y-5 mb-5">
            <p className="text-2xl font-semibold leading-none tracking-tight">
              {detailImage.image_title}
            </p>
            <div>
              <div className="flex justify-between items-end mb-2">
                <p className="text-lg font-semibold leading-none tracking-tight">
                  Description
                </p>
                <div className="flex items-center justify-end gap-4 p-3">
                  <ButtonLike
                    likes={detailImage.likes}
                    image_id={detailImage.id}
                    className={
                      "text-xs [&_svg]:h-5 [&_svg]:w-5 md:[&_svg]:h-6 md:[&_svg]:w-6"
                    }
                  />
                  <ButtonSaveToAlbum
                    image_id={detailImage.id}
                    className={
                      "text-xs [&_svg]:h-5 [&_svg]:w-5 md:[&_svg]:h-6 md:[&_svg]:w-6"
                    }
                  />
                  <ButtonShare
                    className={
                      "text-xs [&_svg]:h-5 [&_svg]:w-5 md:[&_svg]:h-6 md:[&_svg]:w-6"
                    }
                  />
                  <ButtonReportIssue
                    content_type={"image"}
                    content_id={detailImage.id}
                    className={
                      "text-xs [&_svg]:h-5 [&_svg]:w-5 md:[&_svg]:h-6 md:[&_svg]:w-6"
                    }
                  />
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {detailImage.image_description}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <AvatarUserComponent
                username={detailImage.owner.username}
                imageUrl={detailImage.owner.avatar}
              />
              <Button
                size="sm"
                onClick={() => push(`/profile/${detailImage.owner.username}`)}
              >
                View profile
              </Button>
            </div>
          </div>
          <CommentSection imageId={imageId} />
        </div>
      </div>
    </DrawerContent>
  );
}
