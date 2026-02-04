import { InputGroupInput } from "@/components/ui/input-group";

export interface AddressBarProps {
  url: string;
  onUrlChange: (url: string) => void;
  onClick?: () => void;
}

export const AddressBar = ({ url, onUrlChange, onClick }: AddressBarProps) => {
  return (
    <InputGroupInput
      id="inline-start-input"
      className="font-mono"
      type="url"
      placeholder="https://example.com"
      value={url}
      onChange={(e) => onUrlChange(e.target.value)}
      onClick={onClick}
    />
  );
};
