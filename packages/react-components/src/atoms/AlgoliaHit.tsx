interface AlgoliaHitProps {
  objectId?: string;
  algoliaQueryId?: string;
  index: number;
}
const AlgoliaHit: React.FC<AlgoliaHitProps> = ({
  objectId,
  index,
  algoliaQueryId,
  children,
}) => (
  <div
    data-insights-object-id={objectId}
    data-insights-position={index ? index + 1 : undefined}
    data-insights-query-id={algoliaQueryId}
  >
    {children}
  </div>
);

export default AlgoliaHit;
