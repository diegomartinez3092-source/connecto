import { PageHeader } from "./PageHeader";
import { AgentConfigForm } from "./AgentConfigForm";
import { ChannelsForm } from "./ChannelsForm";

interface ConfigPageProps {
  onBack: () => void;
}

export function ConfigPage({ onBack }: ConfigPageProps) {
  return (
    <div className="space-y-6">
      <PageHeader status="active" variant="config" onBack={onBack} />
      <div className="grid gap-4 lg:grid-cols-2">
        <AgentConfigForm />
        <ChannelsForm />
      </div>
    </div>
  );
}
