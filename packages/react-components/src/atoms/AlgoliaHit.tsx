interface AlgoliaHitProps {
  objectId?: string;
  algoliaQueryId?: string;
  index: number;
}
const AlgoliaHit: React.FC<React.PropsWithChildren<AlgoliaHitProps>> = ({
  objectId,
  index,
  algoliaQueryId,
  children,
}) => (
  <div
    data-insights-object-id={objectId}
    data-insights-position={index !== undefined ? index + 1 : undefined}
    data-insights-query-id={algoliaQueryId}
  >
    {children}
  </div>
);

export default AlgoliaHit;
