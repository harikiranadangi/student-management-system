import UserCard from './UserCard';

const UserCardsContainer = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <UserCard type="user" />
      <UserCard type="product" />
      <UserCard type="order" />
      <UserCard type="category" />
    </div>
  );
};

export default UserCardsContainer;

