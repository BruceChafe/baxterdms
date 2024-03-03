import React from 'react';
import { Breadcrumbs, Typography, Link } from '@mui/material';
import { useLocation } from 'react-router-dom';

const CustomBreadcrumbs = ({ title }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
        return isLast ? (
          <Typography key={name} color="inherit" variant="h5">
            {title || capitalizedName}
          </Typography>
        ) : (
          <Link key={name} color="inherit" href={routeTo} variant="h4" underline="none">
          {capitalizedName}
        </Link>
      );
      })}
    </Breadcrumbs>
  );
};

export default CustomBreadcrumbs;
