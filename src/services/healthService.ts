const getStatus = () => {
  return { status: "ok", uptime: process.uptime() };
};

export default { getStatus };
