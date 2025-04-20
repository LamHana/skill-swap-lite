import { PageHeader, PageHeaderHeading } from '@/components/common/page-header';
import { GET_ALL_USERS, getUsers } from '@/services/user.service';
import { useQuery } from '@tanstack/react-query';

const Home = () => {
    const { data: users, isLoading } = useQuery({
        queryKey: [GET_ALL_USERS],
        queryFn: getUsers,
        select: (data) => data.data,
    });

    return (
        <>
            <PageHeader>
                <PageHeaderHeading>Home</PageHeaderHeading>
            </PageHeader>
            {isLoading && <div>Loading...</div>}
            <div className="container">
                <div className="row">
                    {users?.map((user) => (
                        <div
                            className="col-md-4"
                            key={user.id}
                        >
                            <div className="card">
                                <div className="card-body">{user.name}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Home;
