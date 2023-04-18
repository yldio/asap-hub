interface AlgoliaHitProps {
  objectId?: string;
  index?: number;
  queryId?: string;
}
const AlgoliaHit: React.FC<AlgoliaHitProps> = ({
  objectId,
  queryId,
  index,
  children,
}) => (
  <div
    data-insights-object-id={objectId}
    data-insights-position={queryId}
    data-insights-query-id={index}
  >
    {children}
  </div>
);

export default AlgoliaHit;
