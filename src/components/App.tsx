import { Heading } from "@chakra-ui/react";
import loadable from "@loadable/component";
import { memo } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Pool } from "../utils/poolUtils";
import FullPageSpinner from "./shared/FullPageSpinner";
import Layout from "./shared/Layout";

const FusePoolsPage = loadable(
  () => import(/* webpackPrefetch: true */ "./pages/Fuse/FusePoolsPage"),
  {
    fallback: <FullPageSpinner />,
  }
);

const FusePoolPage = loadable(
  () => import(/* webpackPrefetch: true */ "./pages/Fuse/FusePoolPage"),
  {
    fallback: <FullPageSpinner />,
  }
);

const FusePoolInfoPage = loadable(
  () => import(/* webpackPrefetch: true */ "./pages/Fuse/FusePoolInfoPage"),
  {
    fallback: <FullPageSpinner />,
  }
);

const FusePoolEditPage = loadable(
  () => import(/* webpackPrefetch: true */ "./pages/Fuse/FusePoolEditPage"),
  {
    fallback: <FullPageSpinner />,
  }
);

const FusePoolCreatePage = loadable(
  () => import(/* webpackPrefetch: true */ "./pages/Fuse/FusePoolCreatePage"),
  {
    fallback: <FullPageSpinner />,
  }
);

const FuseLiquidationsPage = loadable(
  () => import(/* webpackPrefetch: true */ "./pages/Fuse/FuseLiquidationsPage"),
  {
    fallback: <FullPageSpinner />,
  }
);

const PageNotFound = memo(() => {
  return (
    <Heading
      color="#FFF"
      style={{
        position: "fixed",
        left: "50%",
        top: "50%",
        marginTop: "-15px",
        marginLeft: "-114px",
      }}
    >
      404: Not Found
    </Heading>
  );
});

const App = memo(() => {
  return (
    <Layout>
      <Routes>
        {/* <Route path="/pools" element={<Outlet />}>
          {Object.values(Pool).map((pool) => {
            return (
              <Route
                key={pool}
                path={pool}
                element={<PoolPortal pool={pool} />}
              />
            );
          })}

          <Route path="/" element={<Navigate to="/" replace={true} />} />
        </Route> */}

        {/* <Route path="/tranches" element={<TranchesPage />} />

        <Route path="/pool2" element={<Pool2Page />} /> */}

        <Route path="/fuse" element={<FusePoolsPage />} />
        <Route path="/fuse/liquidations" element={<FuseLiquidationsPage />} />
        <Route path="/fuse/new-pool" element={<FusePoolCreatePage />} />
        <Route path="/fuse/pool/:poolId" element={<FusePoolPage />} />
        <Route path="/fuse/pool/:poolId/edit" element={<FusePoolEditPage />} />

        {/* <Route path="/utils" element={<Navigate to="/" replace={true} />} />
        <Route path="/utils/interest-rates" element={<InterestRatesPage />} />
        <Route path="/utils/positions" element={<StatsPage />} /> */}

        {/* Backwards Compatibility Routes */}
        {/* <Route
          path="/interest_rates"
          element={<Navigate to="/utils/interest-rates" replace={true} />}
        />
        <Route
          path="/interest-rates"
          element={<Navigate to="/utils/interest-rates" replace={true} />}
        />
        <Route
          path="/positions"
          element={<Navigate to="/utils/positions" replace={true} />}
        /> */}
        {/* Backwards Compatibility Routes */}

        {/* <Route path="/" element={<MultiPoolPortal />} /> */}

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Layout>
  );
});

export default App;
