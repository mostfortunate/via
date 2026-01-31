export default function Footer() {
  return (
    <footer className="p-4">
      <p className="text-muted-foreground text-center text-sm">
        © {new Date().getFullYear()} Via. Licensed under the MIT license.
      </p>
    </footer>
  );
}
