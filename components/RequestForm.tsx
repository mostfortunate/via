import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HTTPMethod } from "@/app/types/http";

interface RequestFormProps {
  url: string;
  setUrl: (url: string) => void;
  method: HTTPMethod;
  setMethod: (method: HTTPMethod) => void;
  methods: string[];
  onSend: () => void;
}

const RequestForm = ({
  url,
  setUrl,
  method,
  setMethod,
  methods,
  onSend,
}: RequestFormProps) => {
  return (
    <div className="flex flex-row gap-4">
      <Select value={method} onValueChange={setMethod}>
        <SelectTrigger className="font-semibold w-full max-w-48">
          <SelectValue placeholder={method} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {methods.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Input
        type="url"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <Button className="font-semibold" type="submit" onClick={onSend}>
        Send
      </Button>
    </div>
  );
};

export default RequestForm;
