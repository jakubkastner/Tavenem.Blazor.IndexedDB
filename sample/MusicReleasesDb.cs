public static class MusicReleasesDb
{
	public static readonly string Name = "MusicReleasesTest";
	public static readonly int Version = 1;

	public static readonly string Users = nameof(Users);

	public static readonly string Updates = nameof(Updates);

	public static readonly string UsersArtists = nameof(UsersArtists);
	public static readonly string ArtistsReleases = nameof(ArtistsReleases);

	public static readonly string Artists = nameof(Artists);
	public static readonly string Releases = nameof(Releases);

	public static readonly string Tracks = nameof(Tracks);

	public static string[] GetDatabases()
	{
		return [
			Users,
			Updates,
			UsersArtists,
			ArtistsReleases,
			Artists,
			Releases,
			Tracks,
		];
	}
}