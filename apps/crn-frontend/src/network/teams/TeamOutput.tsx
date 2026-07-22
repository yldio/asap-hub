// Team Output now is the same as Project Output
// as soon as we remove the feature flag
// PROJECT_OUTPUTS we can delete this re-export
import ProjectOutput from '../../projects/ProjectOutput';

const TeamOutput = ProjectOutput;

export default TeamOutput;
