import React, { useState } from "react";
import { Column, Center, RowOrColumn, useWindowSize } from "buttered-chakra";
import { Heading, Link, Spinner, Text, useDisclosure } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useRari } from "../../context/RariContext";
import CopyrightSpacer from "../shared/CopyrightSpacer";
import DashboardBox from "../shared/DashboardBox";
import ForceAuthModal from "../shared/ForceAuthModal";
import { Header } from "../shared/Header";
import { useQuery } from "react-query";
import { useInterval } from "../shared/MovingStat";
import { NewsAndTwitterLink } from "./MultiPoolPortal";
import { ClaimRGTModal } from "../shared/ClaimRGTModal";
import { smallUsdFormatter } from "../../utils/bigUtils";

const Pool2Page = () => {
  const { isAuthed } = useRari();

  const { t } = useTranslation();

  const isMobile = useIsSmallScreen();

  return (
    <>
      <ForceAuthModal />

      <Column
        mainAxisAlignment="flex-start"
        crossAxisAlignment="center"
        color="#FFFFFF"
        mx="auto"
        width={isMobile ? "100%" : "1000px"}
        px={isMobile ? 4 : 0}
      >
        <Header isAuthed={isAuthed} />

        <Column
          width="100%"
          mainAxisAlignment="flex-start"
          crossAxisAlignment="center"
        >
          <DashboardBox height={isMobile ? "110px" : "95px"} width="100%">
            <Column
              expand
              mainAxisAlignment="center"
              crossAxisAlignment={isMobile ? "center" : "flex-start"}
              textAlign="center"
              px={4}
            >
              <Heading size="lg">{t("Sushiswap LP Rewards")}</Heading>

              {t(
                "Earn additional rewards for providing RGT liquidity on Sushiswap!"
              )}
            </Column>
          </DashboardBox>

          <DashboardBox mt={4} width="100%" height="100px">
            <NewsAndTwitterLink />
          </DashboardBox>

          <RowOrColumn
            mt={4}
            isRow={!isMobile}
            mainAxisAlignment="flex-start"
            crossAxisAlignment="flex-start"
            width="100%"
            height={isMobile ? "auto" : "200px"}
          >
            <DashboardBox
              height={isMobile ? "auto" : "100%"}
              width={isMobile ? "100%" : "70%"}
              p={4}
            >
              <RowOrColumn
                mainAxisAlignment="flex-start"
                crossAxisAlignment="flex-start"
                height="100%"
                width="100%"
                isRow={!isMobile}
              >
                <Column
                  mainAxisAlignment="flex-start"
                  crossAxisAlignment="flex-start"
                  width="164px"
                  flexShrink={0}
                >
                  <Heading fontSize="25px">{t("RGT-ETH Pool")} </Heading>

                  <Text mt={3}>
                    {t(
                      "Provide liquidity to the RGT-ETH pool to acquire LP tokens"
                    )}{" "}
                    <Link
                      isExternal
                      href="https://app.sushiswap.fi/pair/0x18a797c7c70c1bf22fdee1c09062aba709cacf04"
                    >
                      <u>{t("here")}</u>
                    </Link>{" "}
                    {t("and stake them for extra rewards!")}
                  </Text>
                </Column>

                <Column
                  mainAxisAlignment="flex-start"
                  crossAxisAlignment="center"
                  width="100%"
                  height="100%"
                  ml={4}
                >
                  <GeneralInfo />
                </Column>

                <Column
                  mainAxisAlignment="flex-start"
                  crossAxisAlignment="center"
                  width="100%"
                  height="100%"
                  ml={4}
                >
                  <YourBalance />
                </Column>
              </RowOrColumn>
            </DashboardBox>

            <Column
              mt={isMobile ? 4 : 0}
              pl={isMobile ? 0 : 4}
              width={isMobile ? "100%" : "30%"}
              height={isMobile ? "auto" : "100%"}
              mainAxisAlignment="flex-start"
              crossAxisAlignment="flex-start"
            >
              <DashboardBox
                p={4}
                width="100%"
                height={isMobile ? "auto" : "50%"}
              >
                <TotalStaked />
              </DashboardBox>

              <DashboardBox
                mt={4}
                p={4}
                width="100%"
                height={isMobile ? "auto" : "50%"}
              >
                <StartAndEnd />
              </DashboardBox>
            </Column>
          </RowOrColumn>
        </Column>
      </Column>
      <CopyrightSpacer forceShow={isMobile} />
    </>
  );
};

export const TotalStaked = () => {
  const { t } = useTranslation();

  const { rari } = useRari();

  const { data: totalStaked } = useQuery("pool2TotalStaked", async () => {
    return parseFloat(
      rari.web3.utils.fromWei(
        await rari.governance.rgt.sushiSwapDistributions.totalStakedUsd()
      )
    );
  });

  return (
    <Column expand mainAxisAlignment="center" crossAxisAlignment="center">
      <Heading mb={1} size="sm">
        {t("Total Staked (USD)")}
      </Heading>
      <Text>{totalStaked ? smallUsdFormatter(totalStaked) : "?"}</Text>
    </Column>
  );
};

const startDate = Date.parse("22 Feb 2021 00:10:00 PST");
// 3 years = 9.461e+10
const endDate = startDate + 9.461e10;

export const StartAndEnd = () => {
  const { t } = useTranslation();

  const { rari } = useRari();

  const { data: hasStarted } = useQuery(
    "hasSushiswapRewardsStarted",
    async () => {
      const block = await rari.web3.eth.getBlockNumber();

      const startingBlock =
        rari.governance.rgt.sushiSwapDistributions.DISTRIBUTION_START_BLOCK;

      return block >= startingBlock;
    }
  );

  return (
    <Column expand mainAxisAlignment="center" crossAxisAlignment="center">
      <Heading mb={1} size="sm">
        {hasStarted ? t("Bonus Rewards End") : t("Bonus Rewards Begin")}
      </Heading>
      {hasStarted !== undefined ? (
        <Countdown endDate={hasStarted ? endDate : startDate} />
      ) : (
        <Spinner m={2} />
      )}
    </Column>
  );
};

const Countdown = ({ endDate }: { endDate: number }) => {
  const [msLeft, setMsLeft] = useState(endDate - Date.now());

  const seconds = Math.floor((msLeft / 1000) % 60);
  const minutes = Math.floor((msLeft / 1000 / 60) % 60);
  const hours = Math.floor((msLeft / (1000 * 60 * 60)) % 24);
  const days = Math.floor(msLeft / (1000 * 60 * 60 * 24));

  useInterval(() => {
    setMsLeft(endDate - Date.now());
  }, 1000);

  return (
    <Text>
      <b>{days}</b> days&nbsp; <b>{hours}</b> hrs&nbsp; <b>{minutes}</b>{" "}
      min.&nbsp; <b>{seconds}</b> sec
    </Text>
  );
};

const YourBalance = () => {
  const { t } = useTranslation();

  const { rari, address } = useRari();

  const { data: balance } = useQuery(address + "pool2Balance", async () => {
    return parseFloat(
      rari.web3.utils.fromWei(
        await rari.governance.rgt.sushiSwapDistributions.stakingBalanceOf(
          address
        )
      )
    );
  });

  const { data: earned } = useQuery(
    address + "pool2Unclaimed RGT",
    async () => {
      return parseFloat(
        rari.web3.utils.fromWei(
          await rari.governance.rgt.sushiSwapDistributions.getUnclaimed(address)
        )
      );
    }
  );

  console.log(balance);

  const {
    isOpen: isClaimRGTModalOpen,
    onOpen: openClaimRGTModal,
    onClose: closeClaimRGTModal,
  } = useDisclosure();

  return (
    <Column
      mainAxisAlignment="flex-start"
      crossAxisAlignment="center"
      width="100%"
      height="100%"
      style={!balance ? { opacity: "0.3", pointerEvents: "none" } : {}}
    >
      <ClaimRGTModal
        isOpen={isClaimRGTModalOpen}
        onClose={closeClaimRGTModal}
        defaultMode="pool2"
      />
      <Heading fontSize="20px">{t("Your Balance")}</Heading>
      <Text mt={3} width="70%" textAlign="center">
        {balance ? balance.toFixed(8) : "0"} SLP
      </Text>
      <Text mt={5} width="70%" textAlign="center">
        <b>
          {earned ? earned.toFixed(2) : "0"} {t("RGT Earned")}
        </b>
      </Text>
      <DashboardBox
        mt="auto"
        width="70%"
        height="45px"
        borderRadius="7px"
        fontSize="xl"
        fontWeight="bold"
        as="button"
        onClick={openClaimRGTModal}
      >
        <Center expand>{t("Claim RGT")}</Center>
      </DashboardBox>
    </Column>
  );
};

const GeneralInfo = () => {
  const { t } = useTranslation();

  const { rari } = useRari();

  const { data: apr } = useQuery("pool2APR", async () => {
    const blockNumber = await rari.web3.eth.getBlockNumber();
    const tvl = await rari.governance.rgt.sushiSwapDistributions.totalStakedUsd();

    return parseInt(
      rari.web3.utils.fromWei(
        await rari.governance.rgt.sushiSwapDistributions.getCurrentApr(
          blockNumber,
          tvl
        )
      )
    ).toFixed(2);
  });

  return (
    <>
      <Heading fontSize="20px">{apr ?? "?"}% APY</Heading>
      <Text mt={3} width="70%" textAlign="center">
        {t("Deposit your LP tokens here to earn bonus RGT rewards!")}
      </Text>
      <DashboardBox
        mt="auto"
        width="70%"
        height="45px"
        borderRadius="7px"
        fontSize="xl"
        fontWeight="bold"
        as="button"
      >
        <Center expand>{t("Deposit")}</Center>
      </DashboardBox>
    </>
  );
};

export default Pool2Page;

const useIsSmallScreen = () => {
  const { width } = useWindowSize();

  return width < 1030;
};
