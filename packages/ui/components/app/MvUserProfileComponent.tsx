import { useAtom } from "jotai";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import React from "react";
import { iconColors, iconSizes } from "../../lib/constants";
import { useUser } from "../../lib/hooks/useUser";
import { profileAtom } from "../../lib/store/auth";
import { slideOutPanelAtom, selectedMemberAtom } from "../../lib/store/ui";
import MvAvatar from "../common/MvAvatar";
import MvLoader from "./MvLoader";
import MvProfileDetail from "./MvProfileDetail";

const MvUserProfileComponent: React.FC = () => {
  const { profile } = useUser();

  const [selectedMember, setMember] = useAtom(selectedMemberAtom);
  const setPanel = useUpdateAtom(slideOutPanelAtom);

  const onSelect = () => {
    if (profile.data) {
      setPanel({ show: true, component: MvProfileDetail, title: "Profile" });
      setMember(profile.data);
    }
  };

  return profile?.data?.loading ? (
    <MvLoader isPage={false} />
  ) : (
    <div className="flex-shrink-0 flex bg-indigo-200 p-4">
      <button onClick={onSelect} className="flex-shrink-0 w-full group block">
        <div className="flex items-center">
        
            <MvAvatar
              isText
              name={profile?.data?.name}
              colorInner={iconColors.avatar.inner_green}
              color={iconColors.avatar.red}
              size={iconSizes.md}
            />
          
          <div className=" ml-3">
            <p className="text-sm w-40 truncate font-medium text-gray-900">
              {profile?.data?.objectID}
            </p>
            <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
              View
            </p>
          </div>
        </div>
      </button>
    </div>
  );
};

export default MvUserProfileComponent;