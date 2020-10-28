import React from 'react';

import { Paragraph, TextField } from '../atoms';
import Subtitle from '../atoms/Subtitle';
import ModalEditHeader from '../molecules/ModalEditHeader';
import { Modal } from '../molecules';

const EditLinkModal: React.FC<{}> = () => (
  <Modal>
    <ModalEditHeader title="Edit Link" />
    <Subtitle>Add URL</Subtitle>
    <Paragraph accent="lead">
      Ensure sharing settings have been adjusted so that your team can access
      this link.
    </Paragraph>
    <TextField value="" />
    <Subtitle>Tool Name</Subtitle>
    <TextField value="" />
    <Subtitle>Description</Subtitle>
    <Paragraph accent="lead">
      Help your team understand what this link is used for.
    </Paragraph>
    <TextField value="" />
  </Modal>
);

export default EditLinkModal;
