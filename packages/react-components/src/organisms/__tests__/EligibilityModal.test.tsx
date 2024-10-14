import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps, ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';

import EligibilityModal from '../EligibilityModal';

const renderModal = (children: ReactNode) =>
  render(<MemoryRouter>{children}</MemoryRouter>);

describe('EligibilityModal', () => {
  const defaultProps: ComponentProps<typeof EligibilityModal> = {
    onDismiss: jest.fn(),
    onGoToManuscriptForm: jest.fn(),
    setEligibilityReasons: jest.fn(),
  };

  it('renders title, description and asap funded question', () => {
    const { container } = renderModal(<EligibilityModal {...defaultProps} />);

    expect(container).toHaveTextContent('Do you need to submit a manuscript?');
    expect(container).toHaveTextContent(
      'The ASAP Open Science Team only conducts compliance reviews on ASAP-funded work. If your manuscript does not contain ASAP-funded work, do NOT mention ASAP as a funder in the acknowledgments, or as an affiliation.',
    );
    expect(container).toHaveTextContent(
      'Does this manuscript contain ASAP-funded work?',
    );
  });

  it('renders funding reason question when user selects Yes in the asap funded question', () => {
    const { container } = renderModal(<EligibilityModal {...defaultProps} />);

    const fundingReasonQuestionText =
      'Select the option that describes why the submitted manuscript should be considered an ASAP-funded article';

    expect(container).not.toHaveTextContent(fundingReasonQuestionText);

    userEvent.click(screen.getByText('Yes'));

    expect(container).toHaveTextContent(fundingReasonQuestionText);
  });

  it('calls onDismiss when user clicks on "Cancel" button', () => {
    const onDismiss = jest.fn();
    renderModal(<EligibilityModal {...defaultProps} onDismiss={onDismiss} />);

    userEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(onDismiss).toHaveBeenCalled();
  });

  it('calls onDismiss when user clicks on "Close" button', () => {
    const onDismiss = jest.fn();
    renderModal(<EligibilityModal {...defaultProps} onDismiss={onDismiss} />);

    userEvent.click(screen.getByTitle(/close/i));

    expect(onDismiss).toHaveBeenCalled();
  });

  describe('Continue button', () => {
    it('becomes enabled when user selects "No" in the asap funded question', () => {
      renderModal(<EligibilityModal {...defaultProps} />);

      const continueButton = screen.getByRole('button', { name: /continue/i });
      expect(continueButton).toBeDisabled();
      userEvent.click(screen.getByText('No'));
      expect(continueButton).toBeEnabled();
    });

    it('remains disabled when user selects "Yes" in the asap funded question but have not select a funding reason yet', () => {
      renderModal(<EligibilityModal {...defaultProps} />);

      const continueButton = screen.getByRole('button', { name: /continue/i });
      expect(continueButton).toBeDisabled();
      userEvent.click(screen.getByText('Yes'));
      expect(continueButton).toBeDisabled();
    });

    it('becomes enabled when user selects "Yes" in the asap funded question and selects a funding reason yet', () => {
      renderModal(<EligibilityModal {...defaultProps} />);

      const continueButton = screen.getByRole('button', { name: /continue/i });
      expect(continueButton).toBeDisabled();
      userEvent.click(screen.getByText('Yes'));
      userEvent.click(
        screen.getByText(
          'The manuscript contains projects that are listed as part of the team’s ASAP-funded proposal.',
        ),
      );
      expect(continueButton).toBeEnabled();
    });
  });

  describe('Not ASAP funded flow', () => {
    it('changes title, description and buttons when not asap funded', () => {
      const { container } = renderModal(<EligibilityModal {...defaultProps} />);

      expect(container).not.toHaveTextContent(
        /Manuscript is not part of ASAP Compliance Review/i,
      );
      expect(container).not.toHaveTextContent(
        /Since this manuscript does not contain ASAP-funded work, it will not undergo a compliance review/i,
      );
      expect(
        screen.queryByRole('button', { name: /go back/i }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /go to team page/i }),
      ).not.toBeInTheDocument();

      userEvent.click(screen.getByText('No'));

      userEvent.click(screen.getByRole('button', { name: /continue/i }));

      expect(container).toHaveTextContent(
        /Manuscript is not part of ASAP Compliance Review/i,
      );
      expect(container).toHaveTextContent(
        /Since this manuscript does not contain ASAP-funded work, it will not undergo a compliance review/i,
      );
      expect(
        screen.getByRole('button', { name: /go back/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /go to team page/i }),
      ).toBeInTheDocument();
    });

    it('goes back to first message when user clicks go back', () => {
      const { container } = renderModal(<EligibilityModal {...defaultProps} />);
      userEvent.click(screen.getByText('No'));
      userEvent.click(screen.getByRole('button', { name: /continue/i }));
      userEvent.click(screen.getByRole('button', { name: /go back/i }));

      expect(container).toHaveTextContent(
        /Do you need to submit a manuscript?/i,
      );
      expect(container).toHaveTextContent(
        /Does this manuscript contain ASAP-funded work?/i,
      );
    });

    it('calls onDismiss when user clicks go to team page', () => {
      const onDismiss = jest.fn();
      renderModal(<EligibilityModal {...defaultProps} onDismiss={onDismiss} />);
      userEvent.click(screen.getByText('No'));
      userEvent.click(screen.getByRole('button', { name: /continue/i }));
      userEvent.click(screen.getByRole('button', { name: /go to team page/i }));

      expect(onDismiss).toHaveBeenCalled();
    });
  });

  describe('ASAP funded flow', () => {
    it('calls onGoToManuscriptForm when user clicks Continue after selecting asap funded and funding reason', () => {
      const onGoToManuscriptForm = jest.fn();
      renderModal(
        <EligibilityModal
          {...defaultProps}
          onGoToManuscriptForm={onGoToManuscriptForm}
        />,
      );

      userEvent.click(screen.getByText('Yes'));
      userEvent.click(
        screen.getByText(
          'The manuscript contains projects that are listed as part of the team’s ASAP-funded proposal.',
        ),
      );

      userEvent.click(screen.getByRole('button', { name: /continue/i }));

      expect(onGoToManuscriptForm).toHaveBeenCalled();
    });

    it('calls setEligibilityReasons with funding reasons when user clicks Continue after selecting asap funded and funding reason', () => {
      const setEligibilityReasons = jest.fn();
      renderModal(
        <EligibilityModal
          {...defaultProps}
          setEligibilityReasons={setEligibilityReasons}
        />,
      );

      userEvent.click(screen.getByText('Yes'));
      userEvent.click(
        screen.getByText(
          'The manuscript contains projects that are listed as part of the team’s ASAP-funded proposal.',
        ),
      );

      userEvent.click(
        screen.getByText(
          'The manuscript resulted from a pivot that was made as part of the team’s ASAP-funded proposal.',
        ),
      );

      userEvent.click(screen.getByRole('button', { name: /continue/i }));

      expect(setEligibilityReasons).toHaveBeenCalledWith(
        new Set(['projects', 'pivot']),
      );
    });

    it('removes a funding reason when user clicks on it twice', () => {
      const setEligibilityReasons = jest.fn();
      renderModal(
        <EligibilityModal
          {...defaultProps}
          setEligibilityReasons={setEligibilityReasons}
        />,
      );

      userEvent.click(screen.getByText('Yes'));
      userEvent.click(
        screen.getByText(
          'The manuscript contains projects that are listed as part of the team’s ASAP-funded proposal.',
        ),
      );

      userEvent.click(
        screen.getByText(
          'The manuscript resulted from a pivot that was made as part of the team’s ASAP-funded proposal.',
        ),
      );

      userEvent.click(
        screen.getByText(
          'The manuscript contains projects that are listed as part of the team’s ASAP-funded proposal.',
        ),
      );

      userEvent.click(screen.getByRole('button', { name: /continue/i }));

      expect(setEligibilityReasons).toHaveBeenCalledWith(new Set(['pivot']));
    });
  });
});
