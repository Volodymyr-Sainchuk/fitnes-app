import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, CalendarDays, GraduationCap, LayoutGrid, Menu, ShieldCheck, Users, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header/Header.jsx";
import Footer from "../../components/layout/Footer/Footer.jsx";
import PageContainer from "../../components/layout/PageContainer/PageContainer.jsx";
import Loader from "../../components/common/Loader/Loader.jsx";
import Button from "../../components/common/Button/Button.jsx";
import { useAuth } from "../../hooks/useAuth/useAuth.jsx";
import { fetchClasses } from "../../services/classApi.js";
import { fetchMemberships } from "../../services/membershipApi.js";
import { fetchTrainers, createTrainer, updateTrainer, deleteTrainer } from "../../services/trainerApi.js";
import { fetchUsers, updateUserRole, createUser } from "../../services/userApi.js";
import { createClass, updateClass, deleteClass } from "../../services/classApi.js";
import { createMembership, updateMembership, deleteMembership } from "../../services/membershipApi.js";
import AdminAnalyticsSection from "../../features/admin-analytics/AdminAnalyticsSection.tsx";

const sectionIcons = {
  overview: <LayoutGrid size={18} />,
  users: <Users size={18} />,
  trainers: <GraduationCap size={18} />,
  classes: <CalendarDays size={18} />,
  memberships: <ShieldCheck size={18} />,
};

const initialTrainerForm = { userId: "", photo: "", bio: "", specialization: "", phone: "", socialLinks: "" };
const initialClassForm = { title: "", description: "", trainerId: "", dateTime: "", duration: "", capacity: "" };
const initialMembershipForm = { name: "", price: "", durationDays: "", benefits: "", isActive: true };
const initialUserForm = { name: "", email: "", password: "", phone: "", role: "MEMBER", socialLinks: "" };

function parseSocialLinks(rawValue) {
  if (!rawValue?.trim()) return null;
  try {
    const parsed = JSON.parse(rawValue);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return null;
    const normalized = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === "string" && value.trim()) normalized[key] = value.trim();
    }
    return Object.keys(normalized).length ? normalized : null;
  } catch {
    return null;
  }
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [pendingAction, setPendingAction] = useState("");
  const [trainerForm, setTrainerForm] = useState(initialTrainerForm);
  const [classForm, setClassForm] = useState(initialClassForm);
  const [membershipForm, setMembershipForm] = useState(initialMembershipForm);
  const [userForm, setUserForm] = useState(initialUserForm);
  const [editingTrainerId, setEditingTrainerId] = useState(null);
  const [editingClassId, setEditingClassId] = useState(null);
  const [editingMembershipId, setEditingMembershipId] = useState(null);
  const [confirmState, setConfirmState] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { replace: true });
      return;
    }
    if (!authLoading && user?.role !== "ADMIN") {
      navigate("/", { replace: true });
      return;
    }

    loadData();
  }, [authLoading, navigate, user]);

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [usersData, trainersData, classesData, membershipsData] = await Promise.all([
        fetchUsers(1, 50),
        fetchTrainers(),
        fetchClasses(),
        fetchMemberships(),
      ]);
      setUsers(Array.isArray(usersData?.users) ? usersData.users : []);
      setTrainers(Array.isArray(trainersData) ? trainersData : []);
      setClasses(Array.isArray(classesData) ? classesData : []);
      setMemberships(Array.isArray(membershipsData) ? membershipsData : []);
    } catch (err) {
      setError(err.message || "Не вдалося завантажити дані");
    } finally {
      setLoading(false);
    }
  }

  const handleUserSubmit = async (event) => {
    event.preventDefault();
    setPendingAction("user");
    try {
      await createUser({
        name: userForm.name,
        email: userForm.email,
        password: userForm.password,
        role: userForm.role,
        phone: userForm.phone || null,
        socialLinks: parseSocialLinks(userForm.socialLinks),
      });
      setUserForm(initialUserForm);
      await loadData();
    } catch (err) {
      setError(err.message || "Не вдалося створити користувача");
    } finally {
      setPendingAction("");
    }
  };

  const handleRoleChange = async (userId, role) => {
    const target = users.find((item) => item.id === userId);
    if (!target) return;
    if (target.role === "ADMIN" && role !== "ADMIN") {
      setConfirmState({ type: "role", userId, role, label: `${target.name} більше не матиме доступу адміністратора` });
      return;
    }
    await saveRoleChange(userId, role);
  };

  async function saveRoleChange(userId, role) {
    setPendingAction("role");
    try {
      await updateUserRole(userId, role);
      setUsers((current) => current.map((item) => (item.id === userId ? { ...item, role } : item)));
    } catch (err) {
      setError(err.message || "Не вдалося змінити роль");
    } finally {
      setPendingAction("");
      setConfirmState(null);
    }
  }

  const handleTrainerSubmit = async (event) => {
    event.preventDefault();
    setPendingAction("trainer");
    try {
      const payload = {
        userId: Number(trainerForm.userId),
        photo: trainerForm.photo || null,
        bio: trainerForm.bio || null,
        specialization: trainerForm.specialization || null,
        phone: trainerForm.phone || null,
        socialLinks: parseSocialLinks(trainerForm.socialLinks),
      };
      if (editingTrainerId) {
        await updateTrainer(editingTrainerId, payload);
      } else {
        await createTrainer(payload);
      }
      setTrainerForm(initialTrainerForm);
      setEditingTrainerId(null);
      await loadData();
    } catch (err) {
      setError(err.message || "Не вдалося зберегти тренера");
    } finally {
      setPendingAction("");
    }
  };

  const handleClassSubmit = async (event) => {
    event.preventDefault();
    setPendingAction("class");
    try {
      const payload = {
        title: classForm.title,
        description: classForm.description || null,
        trainerId: Number(classForm.trainerId),
        dateTime: new Date(classForm.dateTime).toISOString(),
        duration: Number(classForm.duration),
        capacity: Number(classForm.capacity),
      };
      if (editingClassId) {
        await updateClass(editingClassId, payload);
      } else {
        await createClass(payload);
      }
      setClassForm(initialClassForm);
      setEditingClassId(null);
      await loadData();
    } catch (err) {
      setError(err.message || "Не вдалося зберегти заняття");
    } finally {
      setPendingAction("");
    }
  };

  const handleMembershipSubmit = async (event) => {
    event.preventDefault();
    setPendingAction("membership");
    try {
      const payload = {
        name: membershipForm.name,
        price: Number(membershipForm.price),
        durationDays: Number(membershipForm.durationDays),
        benefits: membershipForm.benefits || null,
        isActive: Boolean(membershipForm.isActive),
      };
      if (editingMembershipId) {
        await updateMembership(editingMembershipId, payload);
      } else {
        await createMembership(payload);
      }
      setMembershipForm(initialMembershipForm);
      setEditingMembershipId(null);
      await loadData();
    } catch (err) {
      setError(err.message || "Не вдалося зберегти абонемент");
    } finally {
      setPendingAction("");
    }
  };

  const requestDelete = (type, id) => {
    setConfirmState({ type, id, label: "Цю дію не можна буде скасувати" });
  };

  const confirmAction = async () => {
    if (!confirmState) return;
    const { type, id } = confirmState;
    try {
      if (type === "role") {
        await saveRoleChange(confirmState.userId, confirmState.role);
        return;
      }
      if (type === "trainer") await deleteTrainer(id);
      if (type === "class") await deleteClass(id);
      if (type === "membership") await deleteMembership(id);
      await loadData();
    } catch (err) {
      setError(err.message || "Не вдалося виконати дію");
    } finally {
      setConfirmState(null);
    }
  };

  if (authLoading || loading) return <Loader label="Підготовлюємо адмін-панель..." />;

  return (
    <>
      <Header />
      <PageContainer>
        <section className="admin-shell">
          <div className="admin-sidebar">
            <div className="admin-sidebar-head">
              <p className="section-eyebrow">Sportlend</p>
              <h2>Адмін-панель</h2>
              <p>Керуйте користувачами, тренерами, заняттями та абонементами.</p>
            </div>
            <div className="admin-nav-list">
              {Object.entries(sectionIcons).map(([key, icon]) => (
                <button
                  key={key}
                  className={`admin-nav-item ${activeTab === key ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab(key);
                    setMobileNavOpen(false);
                  }}
                >
                  {icon}
                  <span>
                    {key === "overview"
                      ? "Огляд"
                      : key === "users"
                        ? "Користувачі"
                        : key === "trainers"
                          ? "Тренери"
                          : key === "classes"
                            ? "Заняття"
                            : "Абонементи"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="admin-content">
            <div className="admin-toolbar">
              <div>
                <p className="section-eyebrow">Панель управління</p>
                <h1>Адміністративний центр</h1>
              </div>
              <button
                className="mobile-menu-toggle admin-mobile-toggle"
                onClick={() => setMobileNavOpen((value) => !value)}
                aria-label="Перемкнути меню"
              >
                {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
            {mobileNavOpen ? (
              <div className="admin-mobile-nav">
                {Object.entries(sectionIcons).map(([key, icon]) => (
                  <button
                    key={key}
                    className={`admin-nav-item ${activeTab === key ? "active" : ""}`}
                    onClick={() => {
                      setActiveTab(key);
                      setMobileNavOpen(false);
                    }}
                  >
                    {icon}
                    <span>
                      {key === "overview"
                        ? "Огляд"
                        : key === "users"
                          ? "Користувачі"
                          : key === "trainers"
                            ? "Тренери"
                            : key === "classes"
                              ? "Заняття"
                              : "Абонементи"}
                    </span>
                  </button>
                ))}
              </div>
            ) : null}

            {error ? <p className="form-error">{error}</p> : null}

            {activeTab === "overview" ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="admin-section">
                <AdminAnalyticsSection />
                <div className="info-card quick-actions">
                  <h3>Швидкі дії</h3>
                  <div className="button-row">
                    <Button variant="primary" onClick={() => setActiveTab("users")}>
                      Керувати користувачами
                    </Button>
                    <Button variant="secondary" onClick={() => setActiveTab("trainers")}>
                      Додати тренера
                    </Button>
                    <Button variant="secondary" onClick={() => setActiveTab("classes")}>
                      Створити заняття
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : null}

            {activeTab === "users" ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="admin-section">
                <div className="section-title">
                  <p className="section-eyebrow">Користувачі</p>
                  <h2>Управління доступом</h2>
                </div>
                <form className="admin-form info-card" onSubmit={handleUserSubmit}>
                  <div className="field-row">
                    <label className="field">
                      <span className="field-label">Ім’я</span>
                      <input
                        className="field-input"
                        value={userForm.name}
                        onChange={(event) => setUserForm((current) => ({ ...current, name: event.target.value }))}
                        required
                      />
                    </label>
                    <label className="field">
                      <span className="field-label">Email</span>
                      <input
                        className="field-input"
                        type="email"
                        value={userForm.email}
                        onChange={(event) => setUserForm((current) => ({ ...current, email: event.target.value }))}
                        required
                      />
                    </label>
                  </div>
                  <div className="field-row">
                    <label className="field">
                      <span className="field-label">Пароль</span>
                      <input
                        className="field-input"
                        type="password"
                        value={userForm.password}
                        onChange={(event) => setUserForm((current) => ({ ...current, password: event.target.value }))}
                        required
                      />
                    </label>
                    <label className="field">
                      <span className="field-label">Роль</span>
                      <select
                        value={userForm.role}
                        onChange={(event) => setUserForm((current) => ({ ...current, role: event.target.value }))}
                      >
                        <option value="MEMBER">MEMBER</option>
                        <option value="TRAINER">TRAINER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </label>
                  </div>
                  <div className="field-row">
                    <label className="field">
                      <span className="field-label">Телефон</span>
                      <input
                        className="field-input"
                        value={userForm.phone}
                        onChange={(event) => setUserForm((current) => ({ ...current, phone: event.target.value }))}
                        placeholder="+380501234567"
                      />
                    </label>
                    <label className="field">
                      <span className="field-label">Соцмережі (JSON)</span>
                      <input
                        className="field-input"
                        value={userForm.socialLinks}
                        onChange={(event) =>
                          setUserForm((current) => ({ ...current, socialLinks: event.target.value }))
                        }
                        placeholder='{"instagram":"https://instagram.com/"}'
                      />
                    </label>
                  </div>
                  <div className="button-row">
                    <Button variant="primary" type="submit" disabled={pendingAction === "user"}>
                      Створити користувача
                    </Button>
                  </div>
                </form>
                <div className="table-card">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Ім’я</th>
                        <th>Email</th>
                        <th>Телефон</th>
                        <th>Соцмережі</th>
                        <th>Роль</th>
                        <th>Дата реєстрації</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((item) => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>{item.email}</td>
                          <td>{item.phone || "—"}</td>
                          <td>{item.socialLinks ? `${Object.keys(item.socialLinks).length} link` : "—"}</td>
                          <td>
                            <select
                              value={item.role}
                              onChange={(event) => handleRoleChange(item.id, event.target.value)}
                              disabled={pendingAction === "role"}
                            >
                              <option value="MEMBER">MEMBER</option>
                              <option value="TRAINER">TRAINER</option>
                              <option value="ADMIN">ADMIN</option>
                            </select>
                          </td>
                          <td>{new Date(item.createdAt).toLocaleDateString("uk-UA")}</td>
                          <td>{item.role === "ADMIN" ? <span className="pill">Admin</span> : null}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            ) : null}

            {activeTab === "trainers" ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="admin-section">
                <div className="section-title">
                  <p className="section-eyebrow">Тренери</p>
                  <h2>Профілі тренерів</h2>
                </div>
                <form className="admin-form info-card" onSubmit={handleTrainerSubmit}>
                  <div className="field-row">
                    <label className="field">
                      <span className="field-label">Користувач</span>
                      <select
                        value={trainerForm.userId}
                        onChange={(event) => setTrainerForm((current) => ({ ...current, userId: event.target.value }))}
                        required
                      >
                        <option value="">Оберіть користувача</option>
                        {users
                          .filter((item) => item.role !== "ADMIN" || item.role === "TRAINER")
                          .map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name} ({item.email})
                            </option>
                          ))}
                      </select>
                    </label>
                    <label className="field">
                      <span className="field-label">Фото URL</span>
                      <input
                        className="field-input"
                        value={trainerForm.photo}
                        onChange={(event) => setTrainerForm((current) => ({ ...current, photo: event.target.value }))}
                        placeholder="https://..."
                      />
                    </label>
                  </div>
                  <div className="field-row">
                    <label className="field">
                      <span className="field-label">Спеціалізація</span>
                      <input
                        className="field-input"
                        value={trainerForm.specialization}
                        onChange={(event) =>
                          setTrainerForm((current) => ({ ...current, specialization: event.target.value }))
                        }
                        placeholder="Функціональний тренінг"
                        required
                      />
                    </label>
                    <label className="field">
                      <span className="field-label">Телефон</span>
                      <input
                        className="field-input"
                        value={trainerForm.phone}
                        onChange={(event) => setTrainerForm((current) => ({ ...current, phone: event.target.value }))}
                        placeholder="+380501234567"
                      />
                    </label>
                  </div>
                  <div className="field-row">
                    <label className="field">
                      <span className="field-label">Соцмережі (JSON)</span>
                      <input
                        className="field-input"
                        value={trainerForm.socialLinks}
                        onChange={(event) =>
                          setTrainerForm((current) => ({ ...current, socialLinks: event.target.value }))
                        }
                        placeholder='{"instagram":"https://instagram.com/"}'
                      />
                    </label>
                  </div>
                  <label className="field">
                    <span className="field-label">Біографія</span>
                    <textarea
                      className="field-input"
                      value={trainerForm.bio}
                      onChange={(event) => setTrainerForm((current) => ({ ...current, bio: event.target.value }))}
                      rows="4"
                      placeholder="Коротко про підхід тренера"
                    />
                  </label>
                  <div className="button-row">
                    <Button variant="primary" type="submit" disabled={pendingAction === "trainer"}>
                      {editingTrainerId ? "Оновити" : "Створити"}
                    </Button>
                    {editingTrainerId ? (
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={() => {
                          setEditingTrainerId(null);
                          setTrainerForm(initialTrainerForm);
                        }}
                      >
                        Скасувати
                      </Button>
                    ) : null}
                  </div>
                </form>
                <div className="table-card">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Тренер</th>
                        <th>Спеціалізація</th>
                        <th>Фото</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {trainers.map((item) => (
                        <tr key={item.id}>
                          <td>{item.user?.name || "—"}</td>
                          <td>{item.specialization || "—"}</td>
                          <td>{item.photo ? <span className="pill">URL</span> : "—"}</td>
                          <td className="table-actions">
                            <Button
                              variant="secondary"
                              onClick={() => {
                                setEditingTrainerId(item.id);
                                setTrainerForm({
                                  userId: String(item.userId),
                                  photo: item.photo || "",
                                  bio: item.bio || "",
                                  specialization: item.specialization || "",
                                  phone: item.user?.phone || "",
                                  socialLinks: item.user?.socialLinks ? JSON.stringify(item.user.socialLinks) : "",
                                });
                              }}
                            >
                              Редагувати
                            </Button>
                            <Button variant="secondary" onClick={() => requestDelete("trainer", item.id)}>
                              Видалити
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            ) : null}

            {activeTab === "classes" ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="admin-section">
                <div className="section-title">
                  <p className="section-eyebrow">Заняття</p>
                  <h2>Планування розкладу</h2>
                </div>
                <form className="admin-form info-card" onSubmit={handleClassSubmit}>
                  <div className="field-row">
                    <label className="field">
                      <span className="field-label">Назва</span>
                      <input
                        className="field-input"
                        value={classForm.title}
                        onChange={(event) => setClassForm((current) => ({ ...current, title: event.target.value }))}
                        required
                      />
                    </label>
                    <label className="field">
                      <span className="field-label">Тренер</span>
                      <select
                        value={classForm.trainerId}
                        onChange={(event) => setClassForm((current) => ({ ...current, trainerId: event.target.value }))}
                        required
                      >
                        <option value="">Оберіть тренера</option>
                        {trainers.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.user?.name || "Тренер"}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <label className="field">
                    <span className="field-label">Опис</span>
                    <textarea
                      className="field-input"
                      value={classForm.description}
                      onChange={(event) => setClassForm((current) => ({ ...current, description: event.target.value }))}
                      rows="4"
                    />
                  </label>
                  <div className="field-row">
                    <label className="field">
                      <span className="field-label">Дата й час</span>
                      <input
                        className="field-input"
                        type="datetime-local"
                        value={classForm.dateTime}
                        onChange={(event) => setClassForm((current) => ({ ...current, dateTime: event.target.value }))}
                        required
                      />
                    </label>
                    <label className="field">
                      <span className="field-label">Тривалість (хв)</span>
                      <input
                        className="field-input"
                        type="number"
                        value={classForm.duration}
                        onChange={(event) => setClassForm((current) => ({ ...current, duration: event.target.value }))}
                        required
                      />
                    </label>
                    <label className="field">
                      <span className="field-label">Місткість</span>
                      <input
                        className="field-input"
                        type="number"
                        value={classForm.capacity}
                        onChange={(event) => setClassForm((current) => ({ ...current, capacity: event.target.value }))}
                        required
                      />
                    </label>
                  </div>
                  <div className="button-row">
                    <Button variant="primary" type="submit" disabled={pendingAction === "class"}>
                      {editingClassId ? "Оновити" : "Створити"}
                    </Button>
                    {editingClassId ? (
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={() => {
                          setEditingClassId(null);
                          setClassForm(initialClassForm);
                        }}
                      >
                        Скасувати
                      </Button>
                    ) : null}
                  </div>
                </form>
                <div className="table-card">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Назва</th>
                        <th>Тренер</th>
                        <th>Дата</th>
                        <th>Місткість</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {classes.map((item) => (
                        <tr key={item.id}>
                          <td>{item.title}</td>
                          <td>{item.trainer?.user?.name || "—"}</td>
                          <td>{new Date(item.dateTime).toLocaleString("uk-UA")}</td>
                          <td>{item.capacity}</td>
                          <td className="table-actions">
                            <Button
                              variant="secondary"
                              onClick={() => {
                                setEditingClassId(item.id);
                                setClassForm({
                                  title: item.title,
                                  description: item.description || "",
                                  trainerId: String(item.trainerId),
                                  dateTime: new Date(item.dateTime).toISOString().slice(0, 16),
                                  duration: item.duration,
                                  capacity: item.capacity,
                                });
                              }}
                            >
                              Редагувати
                            </Button>
                            <Button variant="secondary" onClick={() => requestDelete("class", item.id)}>
                              Видалити
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            ) : null}

            {activeTab === "memberships" ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="admin-section">
                <div className="section-title">
                  <p className="section-eyebrow">Абонементи</p>
                  <h2>Плани підписки</h2>
                </div>
                <form className="admin-form info-card" onSubmit={handleMembershipSubmit}>
                  <div className="field-row">
                    <label className="field">
                      <span className="field-label">Назва</span>
                      <input
                        className="field-input"
                        value={membershipForm.name}
                        onChange={(event) => setMembershipForm((current) => ({ ...current, name: event.target.value }))}
                        required
                      />
                    </label>
                    <label className="field">
                      <span className="field-label">Ціна</span>
                      <input
                        className="field-input"
                        type="number"
                        value={membershipForm.price}
                        onChange={(event) =>
                          setMembershipForm((current) => ({ ...current, price: event.target.value }))
                        }
                        required
                      />
                    </label>
                  </div>
                  <div className="field-row">
                    <label className="field">
                      <span className="field-label">Тривалість (днів)</span>
                      <input
                        className="field-input"
                        type="number"
                        value={membershipForm.durationDays}
                        onChange={(event) =>
                          setMembershipForm((current) => ({ ...current, durationDays: event.target.value }))
                        }
                        required
                      />
                    </label>
                    <label className="field">
                      <span className="field-label">Активний</span>
                      <input
                        type="checkbox"
                        checked={membershipForm.isActive}
                        onChange={(event) =>
                          setMembershipForm((current) => ({ ...current, isActive: event.target.checked }))
                        }
                      />
                    </label>
                  </div>
                  <label className="field">
                    <span className="field-label">Переваги</span>
                    <textarea
                      className="field-input"
                      value={membershipForm.benefits}
                      onChange={(event) =>
                        setMembershipForm((current) => ({ ...current, benefits: event.target.value }))
                      }
                      rows="4"
                      placeholder="Одна перевага на рядок"
                    />
                  </label>
                  <div className="button-row">
                    <Button variant="primary" type="submit" disabled={pendingAction === "membership"}>
                      {editingMembershipId ? "Оновити" : "Створити"}
                    </Button>
                    {editingMembershipId ? (
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={() => {
                          setEditingMembershipId(null);
                          setMembershipForm(initialMembershipForm);
                        }}
                      >
                        Скасувати
                      </Button>
                    ) : null}
                  </div>
                </form>
                <div className="table-card">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Назва</th>
                        <th>Ціна</th>
                        <th>Тривалість</th>
                        <th>Статус</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {memberships.map((item) => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>{item.price} ₴</td>
                          <td>{item.durationDays} днів</td>
                          <td>{item.isActive ? "Активний" : "Неактивний"}</td>
                          <td className="table-actions">
                            <Button
                              variant="secondary"
                              onClick={() => {
                                setEditingMembershipId(item.id);
                                setMembershipForm({
                                  name: item.name,
                                  price: item.price,
                                  durationDays: item.durationDays,
                                  benefits: item.benefits || "",
                                  isActive: item.isActive,
                                });
                              }}
                            >
                              Редагувати
                            </Button>
                            <Button variant="secondary" onClick={() => requestDelete("membership", item.id)}>
                              Видалити
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            ) : null}
          </div>
        </section>
      </PageContainer>
      <Footer />
      {confirmState ? (
        <div className="modal-backdrop">
          <div className="info-card modal-card">
            <h3>Підтвердження</h3>
            <p>{confirmState.label || "Підтвердіть дію"}</p>
            <div className="button-row">
              <Button variant="primary" onClick={confirmAction}>
                Підтвердити
              </Button>
              <Button variant="secondary" onClick={() => setConfirmState(null)}>
                Скасувати
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
