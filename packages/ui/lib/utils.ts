import {
  HomeIcon,
  QuestionMarkCircleIcon,
  UsersIcon,
  LogoutIcon,
} from "@heroicons/react/outline";
import {
  TChainVoteArgs,
  TFormInputs,
  TNavigation,
  TProfile,
  TProfileFormInputs,
  TProposal,
  TRadioGroupSettings,
  TVote,
  TVoteSingle,
} from "../types";
import { pick, truncate } from "lodash";

import * as yup from "yup";
import algoliasearch, { AlgoliaSearchOptions } from "algoliasearch";
import moment from "moment";
import { TMiaStxBalance, TStxUsdPrice } from "./store/ui";

import {
  stringAsciiCV,
  stringUtf8CV,
  trueCV,
  falseCV,
} from "@stacks/transactions";

export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const navigation: TNavigation[] = [
  { name: "Dashboard", icon: HomeIcon, href: "/app" },
  { name: "Members", icon: UsersIcon, href: "/app/members" },
  {
    name: "FAQ's & Help",
    icon: QuestionMarkCircleIcon,
    href: "/app/faqs",
  },
];
export const isCurrentLink = (
  router: Record<string, unknown>,
  href: string
) => {
  return router.pathname == href;
};

export const numberToPercent = (actual: number, total: number): string => {
  return Math.round((actual / total) * 100).toString() + "%";
};

export const algoliaClient = (options?: AlgoliaSearchOptions) =>
  algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_FRONTEND_KEY,
    options
  );

export const summarize = (content: string, length: number = 100) => {
  const regex = /<[^>]+>/g;
  return truncate(content.replace(regex, " ").replace(/\s+/g, " "), {
    length,
    omission: "",
    separator: /,? +/,
  });
};

export const ddOptionsForProposal = () => ({
  type: "custom",
  options: {
    custom: {
      quantity: 20,
      title: "text",
      description: "longText",
    },
  },
});

function objectToQueryString(obj) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

const BASE_MOCK_URL = "https://dummyapi.io/data/v1/";

export const prepareMockUrl = (
  type: string,
  options: Record<string, unknown>
): string => {
  return `${BASE_MOCK_URL}${type}?${objectToQueryString(options)}`;
};

export const fetcher = (url) => fetch(url).then((res) => res.json());

export function errorHandler(err, res) {
  if (typeof err === "string") {
    // custom application error
    const is404 = err.toLowerCase().endsWith("not found");
    const statusCode = is404 ? 404 : 400;
    return res.status(statusCode).json({ message: err });
  }

  if (err.name === "UnauthorizedError") {
    // jwt authentication error
    return res.status(401).json({ message: "Invalid Token" });
  }
  // default to 500 server error
  console.error(err);
  return res.status(500).json({ message: err.message });
}

export async function postData(payload: any, url: string) {
  try {
    const result = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload }),
    });
    return await result.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const proposalYupSchema = yup.object().shape({
  title: yup.string().required(),
  startDate: yup.date().required("Please select a start date"),
  endDate: yup
    .date()
    .min(yup.ref("startDate"), "End date should be later than start date")
    .required("end date is required"),
});

export const membershipYupSchema = yup.object().shape({
  name: yup.string().required(),
});

export const prepareProfile: (data: TProfileFormInputs) => TProfile = (
  data
) => {
  return {
    ...data,
    ...{ isActive: true },
    _tags: ["profile"],
  };
};

export const prepareProposal: (
  data: TFormInputs,
  owner: TProfile,
  summaryLength?: number
) => TProposal<TVoteSingle> = (data, owner, summaryLength) => {
  return {
    body: data.content,
    title: data.title,
    summary: summarize(data.content, summaryLength),
    owner,
    votes: [],
    isClosed: false,
    expiryDate: data.endDate,
    postDate: data.startDate,
    _tags: ["proposal"],
  };
};

export const getBallot = (payload: { vote: TRadioGroupSettings }) => {
  return payload.vote.name === "Yes";
};

export const prepareVote = ({
  proposal,
  voter,
  payload,
  onChainLink,
}: {
  proposal: TProposal<TVoteSingle> | any;
  payload: { vote: TRadioGroupSettings };
  voter: TProfile;
  onChainLink?: string;
}): { votes: TVote<TVoteSingle>[]; objectID: any } => {
  const vote: TVote<TVoteSingle> = {
    vote: { yes: getBallot(payload) },
    voter: pick(voter, ["objectID", "name", "imageUrl", "email"]) as TProfile,
    onChainLink,
  };
  console.log(payload.vote);
  return {
    votes: [...proposal.votes, ...[vote]],
    objectID: proposal.objectID,
  };
};

export const dateGreaterThanNow = (date) => {
  return moment(date).diff(moment()) < 0;
};

//get dynamic price value for miami STX wallet

const MiamiSTXAddress = "SM2MARAVW6BEJCD13YV2RHGYHQWT7TDDNMNRB1MVT";

const CORE_STX_API_ADDRESS =
  "https://stacks-node-api.mainnet.stacks.co/extended/v1";

const COIN_GECKO_TOKEN_PRICE_END_POINT =
  "https://api.coingecko.com/api/v3/simple/price";

const STX_CG_ID = "blockstack";

const SEARCH_CURRENCY = "usd";

const getMiaSTXbalance = async () => {
  const response = await fetch(
    `${CORE_STX_API_ADDRESS}/address/${MiamiSTXAddress}/stx`
  );
  const result = (await response.json()) as TMiaStxBalance;
  console.log(result);
  return result.balance * 0.000001;
};

const getMiaUsdPrice = async () => {
  const urlSearchParams = new URLSearchParams({
    ids: STX_CG_ID,
    vs_currencies: SEARCH_CURRENCY,
  });
  const url = new URL(COIN_GECKO_TOKEN_PRICE_END_POINT);
  url.search = urlSearchParams.toString();
  const response = await fetch(url.toString());
  const result = (await response.json()) as TStxUsdPrice;
  return result.blockstack.usd;
};

export const getMiaUsdValue = async () => {
  const stxValue = await getMiaSTXbalance();
  const usdValue = await getMiaUsdPrice();
  const result = stxValue * usdValue;
  return result;
};

export const prepareVoteArgs = ({
  name,
  email,
  ballot,
  userId,
  proposalId,
}: TChainVoteArgs) => {
  const _ballot = ballot ? trueCV() : falseCV();
  return [
    stringAsciiCV(proposalId),
    _ballot,
    stringAsciiCV(name),
    stringUtf8CV(email),
    stringUtf8CV(userId),
  ];
};
