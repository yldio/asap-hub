interface NetworkWorkingGroupListProps {
  filters: Set<string>;
  searchQuery?: string;
}

const NetworkWorkingGroupList: React.FC<NetworkWorkingGroupListProps> = ({
  filters,
  searchQuery = '',
}) => {
  console.log(filters);
  console.log(searchQuery);
  return <div>list component for working group</div>;
};

export default NetworkWorkingGroupList;
