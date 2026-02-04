import { InputGroupInput } from "@/components/ui/input-group";

export interface AddressBarProps {
  url: string;
  onUrlChange: (url: string) => void;
}

export const AddressBar = ({ url, onUrlChange }: AddressBarProps) => {
  return (
    <InputGroupInput
      id="inline-start-input"
      className="font-mono"
      type="url"
      placeholder="https://example.com"
      value={url}
      onChange={(e) => onUrlChange(e.target.value)}
    />
  );
};
