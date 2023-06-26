import Link from "next/link";
import { Breadcrumbs, Stack, Typography } from "@mui/material";
import { FC } from "react";
import { breadcrumbsVariableTypes } from "@/types/breadcrumbs";
import { FRONTEND_BASE_URL } from "@/config/config";
import styles from "../../styles/login.module.css";
const BreadcrumbsHeading: FC<breadcrumbsVariableTypes> = (props): any => {
  return (
    <Stack direction="row" spacing={2} justifyContent="space-between">
      <Stack>
        <Stack spacing={3}>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            <Link
              key="1"
              color="inherit"
              href={
                props && props?.Link?.includes("user") ? `${FRONTEND_BASE_URL}/user/dashboard` : `${FRONTEND_BASE_URL}/admin/dashboard`
              }
              className={styles.registerPage}
              style={{ color: "#7D86A5", textDecoration: "none" }}
              >
              {props.First}
            </Link>
            {props.Middle ? 
            <Link
              key="2"
              color="inherit"
              href={`/${props.Link}`}
              style={{ color: "#7D86A5", textDecoration: "none" }}
            >
              {props.Middle}
            </Link>:
            ''}
            
            <Link
            key="2"
            color="inherit"
            href={'#'}
            style={{ color: "#E8661B", textDecoration: "none" }}
          >
            {props.Current}
          </Link>
          </Breadcrumbs>
        </Stack>
        <Typography
          variant="h5"
          gutterBottom
          style={{ fontWeight: "bold", color: "#333333" }}
        >
          {props.Text}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default BreadcrumbsHeading;
