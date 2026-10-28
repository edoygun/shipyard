export default function LaunchTile({ launch, size = 56 }) {
  return (
    <div
      className="tile"
      style={{ background: launch.color, width: size, height: size, fontSize: size * 0.45 }}
      aria-hidden="true"
    >
      {launch.name[0]}
    </div>
  );
}
