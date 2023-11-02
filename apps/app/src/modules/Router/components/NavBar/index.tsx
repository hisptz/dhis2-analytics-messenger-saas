import { Tab, TabBar } from "@dhis2/ui"
import React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { NAVIGATION_ITEMS } from "../../../../shared/constants/navigation"
import classes from "./NavBar.module.css"

export default function NavBar(): React.ReactElement {
  const location = useLocation()
  const navigate = useNavigate()
  return (
    <div className={classes.container}>
      <TabBar>
        {NAVIGATION_ITEMS.map(({ label, path, icon }) => {
          const Icon = icon
          return (
            <Tab
              dataTest={`d2-am-${label}-tab`}
              onClick={() => navigate(path)}
              key={`${path}-nav-tab`}
              selected={Boolean(location.pathname.match(path))}
              icon={Icon !== undefined ? <Icon /> : null}
            >
              {label}
            </Tab>
          )
        })}
      </TabBar>
    </div>
  )
}
