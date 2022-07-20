import * as Yup from "yup";
import BaseLayout from "@/components/layout/BaseLayout";
import BasePage from "@/components/layout/BasePage";
import Box from "@/components/box/Box";
import Button from "@/components/btn/Btn";
import Error from "@/components/error/Error";
import ItemChild from "@/components/ItemGroups/ItemChild";
import ItemGroups from "@/components/ItemGroups/ItemGroups";
import Modal from "@/components/modal/Modal";
import React, { useState, useEffect, useContext, useRef } from "react";
import Text from "@/components/text/Text";
import Toggle from "@/components/toggle/Toggle";
import axios from "axios";
import withAuth from "@/shared/hoc/withAuth";
import { AuthContext } from "@/shared/context/auth-context";
import { Container, Row, Col } from "reactstrap";
import { Formik } from "formik";
import { getUser } from "@/utilities/helpers";

const validationSchema = Yup.object({
  firstname: Yup.string().trim().required("Please add a first name"),
  lastname: Yup.string().trim().required("Please add a last name"),
});

const changePasswordValidationSchema = Yup.object({
  oldPassword: Yup.string()
    .trim()
    .min(8, "Password is too short")
    .required("Old password is required"),
  newPassword: Yup.string()
    .trim()
    .min(8, "Password is too short")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .trim()
    .min(8, "Password is too short")
    .required("Please confirm your password"),
});

const Account = () => {
  const [loading, setLoading] = useState(false);
  const [firstRender, setFirstRender] = useState(true);
  const [message, setMessage] = useState();
  const [showEditInfoModal, setShowEditInfoModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [user, setUser] = useState();
  const [personalInformation, setPersonalInformation] = useState();
  const [accountInformation, setAccountInformation] = useState();

  const auth = useContext(AuthContext);
  const userInfo = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  useEffect(() => {
    if (!user) {
      getCurrentUser();
    } else if (firstRender) {
      setPersonalInformation({
        firstname: user?.firstname,
        lastname: user?.lastname,
      });

      setAccountInformation({
        receiveNotifications: user?.receiveNotifications,
        receivePromotions: user?.receivePromotions,
      });
    }
  }, [user]);

  useEffect(() => {
    if (accountInformation && !firstRender) {
      updateAccountInformation();
    } else if (user && accountInformation && firstRender) {
      setFirstRender(false);
    }
  }, [accountInformation]);

  const getCurrentUser = async () => {
    try {
      setUser(await getUser(auth, true));
    } catch (err) {
      setLoading(false);
      setMessage({
        text:
          err.response?.data?.message || err?.message || "Something went wrong",
        error: true,
      });
    }
  };

  const updatePersonalInformation = (values) => {
    const { firstname, lastname } = values;

    if (firstname != user?.firstname || lastname != user?.lastname) {
      setLoading(true);

      let options = {
        method: "POST",
        url: `${process.env.BASE_URL}/api/users/updatePersonalInformation`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        data: JSON.stringify({
          userId: auth?.userId,
          firstname,
          lastname,
        }),
      };

      const postUpdates = async () => {
        try {
          const response = await axios.request(options);
          const data = response.data;

          setLoading(false);
          setShowEditInfoModal(false);
          getCurrentUser();
          setMessage({
            text: "Your personal information is updated",
            error: false,
          });
        } catch (err) {
          setLoading(false);
          setShowEditInfoModal(false);
          setMessage({
            text:
              err.response?.data?.message ||
              err.message ||
              "Something went wrong",
            error: true,
          });
        }
      };
      postUpdates();
    } else {
      setShowEditInfoModal(false);
    }
  };

  const updateAccountInformation = () => {
    const { receiveNotifications, receivePromotions } = accountInformation;

    setLoading(true);

    let options = {
      method: "POST",
      url: `${process.env.BASE_URL}/api/users/updateAccountInformation`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
      data: JSON.stringify({
        userId: auth?.userId,
        receiveNotifications,
        receivePromotions,
      }),
    };

    const postAccountInformation = async () => {
      try {
        const response = await axios.request(options);
        const data = response.data;

        setLoading(false);
        setMessage({
          text: "Your account information is updated",
          error: false,
        });
      } catch (err) {
        setLoading(false);
        setMessage({
          text:
            err.response?.data?.message ||
            err.message ||
            "Something went wrong",
          error: true,
        });
      }
    };
    postAccountInformation();
  };

  const handleChangePassword = (values) => {
    const { oldPassword, newPassword, confirmPassword } = values;

    setLoading(true);

    let options = {
      method: "POST",
      url: `${process.env.BASE_URL}/api/auth/changePassword`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
      data: JSON.stringify({
        userId: auth?.userId,
        oldPassword,
        newPassword,
        confirmPassword,
      }),
    };

    const postPassword = async () => {
      try {
        const response = await axios.request(options);
        const data = response.data;

        setLoading(false);
        setShowChangePasswordModal(false);
        setMessage({
          text: "Your password is updated",
          error: false,
        });
      } catch (err) {
        setLoading(false);
        setShowChangePasswordModal(false);
        setMessage({
          text:
            err.response?.data.message || err.message || "Something went wrong",
          error: true,
        });
      }
    };
    postPassword();
  };

  return (
    <BaseLayout>
      <BasePage header user={user}>
        <Error error={message} setError={setMessage} />
        <Container fluid>
          <Row className="margin-top-15">
            <Col sm={4}>
              <Box
                title="Personal Information"
                icon="fa-solid fa-pen-to-square"
                iconClickHandler={() => setShowEditInfoModal(true)}
              >
                <ItemGroups>
                  <ItemChild bold>Name:</ItemChild>
                  <ItemChild>
                    {user?.firstname} {user?.lastname}
                  </ItemChild>
                </ItemGroups>
                <ItemGroups>
                  <ItemChild bold>Password:</ItemChild>
                  <ItemChild>
                    <span
                      className="link"
                      onClick={() => setShowChangePasswordModal(true)}
                    >
                      Change Password
                    </span>
                  </ItemChild>
                </ItemGroups>
              </Box>
            </Col>
            <Col sm={4}>
              <Box title="Contact Information">
                <ItemGroups>
                  <ItemChild bold>Email:</ItemChild>
                  <ItemChild>{user?.email}</ItemChild>
                </ItemGroups>
                <ItemGroups>
                  <ItemChild bold>Phone:</ItemChild>
                  <ItemChild>{user?.phone}</ItemChild>
                </ItemGroups>
              </Box>
            </Col>
            <Col sm={4}>
              <Box title="Account Information">
                <ItemGroups>
                  <ItemChild bold>Receive Notifications:</ItemChild>
                  <ItemChild>
                    <Toggle
                      changeHandler={() =>
                        setAccountInformation({
                          ...accountInformation,
                          receiveNotifications:
                            !accountInformation?.receiveNotifications,
                        })
                      }
                      checked={
                        accountInformation
                          ? accountInformation?.receiveNotifications
                          : false
                      }
                      handleDiameter={10}
                      height={15}
                      width={30}
                      sm
                      disabled={loading}
                    />
                  </ItemChild>
                </ItemGroups>
                <ItemGroups>
                  <ItemChild bold>Receive Promotions:</ItemChild>
                  <ItemChild>
                    <Toggle
                      changeHandler={() =>
                        setAccountInformation({
                          ...accountInformation,
                          receivePromotions:
                            !accountInformation?.receivePromotions,
                        })
                      }
                      checked={
                        accountInformation
                          ? accountInformation?.receivePromotions
                          : false
                      }
                      handleDiameter={10}
                      height={15}
                      width={30}
                      sm
                      disabled={loading}
                    />
                  </ItemChild>
                </ItemGroups>
              </Box>
            </Col>
          </Row>
        </Container>
        <Modal
          show={showEditInfoModal}
          toggle={() => setShowEditInfoModal(!showEditInfoModal)}
          title="Edit personal information"
        >
          <Formik
            validateOnChange={false}
            initialValues={personalInformation}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              updatePersonalInformation(values);
            }}
          >
            {({
              values,
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
            }) => {
              const { firstname, lastname } =
                values;

              return (
                <div>
                  <Text
                    type="text"
                    name="firstname"
                    placeholder="Jane"
                    label="First Name"
                    error={errors.firstname}
                    onBlur={handleBlur("firstname")}
                    inputHandler={handleChange("firstname")}
                    disabled={loading}
                    value={firstname}
                  />
                  <Text
                    type="text"
                    name="lastname"
                    placeholder="Doe"
                    label="Last Name"
                    error={errors.lastname}
                    onBlur={handleBlur("lastname")}
                    inputHandler={handleChange("lastname")}
                    disabled={loading}
                    value={lastname}
                  />
                  <Button
                    onClick={handleSubmit}
                    className="margin-top-10"
                    loading={loading}
                    block
                  >
                    Update
                  </Button>
                </div>
              );
            }}
          </Formik>
        </Modal>

        <Modal
          show={showChangePasswordModal}
          toggle={() => setShowChangePasswordModal(!showChangePasswordModal)}
          title="Change your password"
        >
          <Formik
            initialValues={userInfo}
            validateOnChange={false}
            validationSchema={changePasswordValidationSchema}
            onSubmit={(values) => {
              handleChangePassword(values);
            }}
          >
            {({
              values,
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
            }) => {
              const { oldPassword, newPassword, confirmPassword } = values;
              return (
                <div>
                  <Text
                    type="password"
                    name="oldPassword"
                    placeholder="Old Password"
                    label="Old Password"
                    error={errors.oldPassword}
                    onBlur={handleBlur("oldPassword")}
                    inputHandler={handleChange("oldPassword")}
                    disabled={loading}
                    value={oldPassword}
                  />
                  <Text
                    type="password"
                    name="newPassword"
                    placeholder="New Password"
                    label="New Password"
                    error={errors.newPassword}
                    onBlur={handleBlur("newPassword")}
                    inputHandler={handleChange("newPassword")}
                    disabled={loading}
                    value={newPassword}
                  />

                  <Text
                    type="password"
                    name="confirmPassword"
                    placeholder="New Password"
                    label="Confirm Password"
                    error={errors.confirmPassword}
                    onBlur={handleBlur("confirmPassword")}
                    inputHandler={handleChange("confirmPassword")}
                    disabled={loading}
                    value={confirmPassword}
                  />
                  <Button
                    onClick={handleSubmit}
                    className="margin-top-10"
                    loading={loading}
                    block
                  >
                    Update
                  </Button>
                </div>
              );
            }}
          </Formik>
        </Modal>
      </BasePage>
    </BaseLayout>
  );
};

export default withAuth(Account);
