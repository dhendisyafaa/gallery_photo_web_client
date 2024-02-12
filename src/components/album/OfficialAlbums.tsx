import { useAllOfficialAlbum } from "@/app/api/resolver/albumResolver";
import AlbumGridView from "./AlbumGridView";
import SkeletonAlbum from "../common/skeleton/SkeletonAlbum";

export default function OfficialAlbums() {
  const { data: dataOfficialAlbums, isLoading: officialAlbumsLoading } =
    useAllOfficialAlbum();

  if (officialAlbumsLoading) return <SkeletonAlbum />;
  const officialAlbums = dataOfficialAlbums.data.data;

  return (
    <div>
      <p className="font-semibold text-primary-foreground mb-2">
        Official albums
      </p>
      {officialAlbums.length !== 0 ? (
        <AlbumGridView
          albums={officialAlbums}
          className={
            "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
          }
        />
      ) : (
        "empty state ofc albums"
      )}
    </div>
  );
}
