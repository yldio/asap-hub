interface InfoParagraphProps {
  readonly boldText: string;
  readonly bodyText: string;
}

const InfoParagraph: React.FC<InfoParagraphProps> = ({
  boldText,
  bodyText,
}) => (
  <span>
    <b>{boldText}</b>
    {bodyText}
  </span>
);

export default InfoParagraph;
