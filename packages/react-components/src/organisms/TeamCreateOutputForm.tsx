import { Button } from '../atoms';

const TeamCreateOutputForm: React.FC<{ onCreate: () => void }> = ({
  onCreate,
}) => <Button onClick={onCreate}>Share</Button>;

export default TeamCreateOutputForm;
