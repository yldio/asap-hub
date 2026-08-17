// Team Output is always team-based, so it re-uses the team-based project
// output flow. Once the PROJECT_OUTPUTS feature flag is removed we can delete
// this re-export.
import TeamBasedOutput from '../../projects/TeamBasedOutput';

const TeamOutput = TeamBasedOutput;
export default TeamOutput;
