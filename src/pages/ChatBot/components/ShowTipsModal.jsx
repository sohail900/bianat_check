import React from "react";
import { IoEyeOutline } from "react-icons/io5";

const ShowTipsModal = () => {
  return (
    <div className="fixed md:top-24 md:-right-40 top-8">
      <div class="max-w-lg mx-auto bg-[#393939] p-5 rounded-md shadow">
        <h1 class="text-md font-bold mb-1">Thoughts starters</h1>
        <ul class="list-disc list-inside">
          <li class="">First item</li>
          <li class="">Second item</li>
          <li class="">Third item</li>
          <li class="">Fourth item</li>
          <li class="">Fifth item</li>
        </ul>
      </div>
    </div>
  );
};

export default ShowTipsModal;
