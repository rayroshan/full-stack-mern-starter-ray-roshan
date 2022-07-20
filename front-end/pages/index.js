import BaseLayout from "@/components/layout/BaseLayout";
import BasePage from "@/components/layout/BasePage";
import Error from "@/components/error/Error";
import React, { useState, useEffect, useContext } from "react";
import withAuth from "@/shared/hoc/withAuth";
import { AuthContext } from "@/shared/context/auth-context";
import { getUser } from "@/utilities/helpers";

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState();
  const [user, setUser] = useState();
  const auth = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      getCurrentUser();
    }
  }, [user]);

  const getCurrentUser = async () => {
    try {
      setUser(await getUser(auth));
    } catch (err) {
      setLoading(false);
      setMessage({
        text:
          err.response?.data?.message || err?.message || "Something went wrong",
        error: true,
      });
    }
  };

  return (
    <BaseLayout>
      <BasePage header user={user}>
        <Error error={message} setError={setMessage} />
        <h1 className="margin-top-15">Welcome {user?.firstname}</h1>
      </BasePage>
    </BaseLayout>
  );
};

export default withAuth(Index);
