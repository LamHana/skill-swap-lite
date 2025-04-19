import { PageHeader, PageHeaderHeading } from '@/components/common/page-header';
import { getAllUsers } from '@/services/user.service';
import { GetAllUsersResponse } from '@/types/user.type';
import { useState } from 'react';
import { useEffect } from 'react';

const Home = () => {
    const [users, setUsers] = useState<GetAllUsersResponse>([]);

    useEffect(() => {
        getAllUsers().then((res) => {
            setUsers(res.data);
        });
    }, []);
    return (
        <>
            <PageHeader>
                <PageHeaderHeading>Home</PageHeaderHeading>
            </PageHeader>
            <div className="container">
                <div className="row">
                    {users.map((user) => (
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
