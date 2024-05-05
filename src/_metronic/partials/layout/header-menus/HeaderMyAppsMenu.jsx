const HeaderMyAppsMenu = () => {
  const listApps = [
    {
      ApplicationName: "Hệ thống",
      ApplicationCode: "system",
      Description: "",
      IsDefaultForAllEmployees: "",
      IsDefaultForAllUsers: "",
      LogoURL: "/media/logos/logo_system.svg",
      URL: "/catering/dashboard",
    },
    {
      ApplicationName: "Thông tin nhân sự",
      ApplicationCode: "employees-information",
      Description: "",
      IsDefaultForAllEmployees: "",
      IsDefaultForAllUsers: "",
      LogoURL: "/media/logos/logo_employee.svg",
      URL: "/employees-information/dashboard",
    },
    {
      ApplicationName: "Chấm công",
      ApplicationCode: "employees-information",
      Description: "",
      IsDefaultForAllEmployees: "",
      IsDefaultForAllUsers: "",
      LogoURL: "/media/logos/logo_timesheet.svg",
      URL: "/timesheet/dashboard",
    },
    {
      ApplicationName: "Quản lý toà nhà",
      ApplicationCode: "building",
      Description: "",
      IsDefaultForAllEmployees: "",
      IsDefaultForAllUsers: "",
      LogoURL: "/media/logos/logo_mintax.svg",
      URL: "/building/dashboard",
    },
    {
      ApplicationName: "Quản lý",
      ApplicationCode: "industrial-catering",
      Description: "",
      IsDefaultForAllEmployees: "",
      IsDefaultForAllUsers: "",
      LogoURL: "/media/logos/logo_aIvan.svg",
      URL: "/industrial-catering/dashboard",
    },
  ];

  return (
    <div
      className="menu menu-sub menu-sub-dropdown menu-column w-100 w-sm-350px"
      data-kt-menu="true"
    >
      <div className="card">
        <div className="card-header">
          <div className="card-title text-gray-800">Danh sách ứng dụng</div>
          <div className="card-toolbar"></div>
        </div>
        <div className="card-body p-0">
          <div className="mh-450px scroll-y me-n5 pe-5">
            <div className="row g-2">
              {listApps.map((item) => (
                <div className="col-4" key={Math.random().toString()}>
                  <a
                    href={item?.URL}
                    className="d-flex flex-column flex-center text-center text-gray-800 text-hover-primary bg-hover-light rounded py-3 px-3"
                  >
                    <img
                      src={item?.LogoURL}
                      className="w-30px h-30px mb-2"
                      alt=""
                    />
                    <span className="fw-semibold">{item?.ApplicationName}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { HeaderMyAppsMenu };
