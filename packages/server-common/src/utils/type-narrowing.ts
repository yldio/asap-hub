/* istanbul ignore file */
import { EventController, gp2 } from '@asap-hub/model';

export const isCRNEventController = (
  controller: EventController | gp2.EventController,
): controller is EventController => 'tags' in controller.create;
