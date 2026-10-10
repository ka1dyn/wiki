"use client";

import { cn } from "@/lib/utils";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Leaf from "./Leaf";
import Folder from "./Folder";
import { useNavTriggerStore } from "@/stores";
import TopFolder from "./TopFolder";

export function TreeItem({
  tree,
  depth,
  isOpen,
}: {
  tree: TreeObj;
  depth: number;
  isOpen: boolean;
}) {
  const { name, count, children, isLeaf, path, isPublish } = tree;
  const [open, setOpen] = useState<boolean>(isOpen);

  const expand = useNavTriggerStore((state) => state.expand);
  const collapse = useNavTriggerStore((state) => state.collapse);

  const lastExpand = useRef(expand);
  const lastCollapse = useRef(collapse);

  const isTop = depth == 1;

  useEffect(() => {
    if (expand !== lastExpand.current) {
      lastExpand.current = expand;
      setOpen(true);
    }
  }, [expand]);

  useEffect(() => {
    if (collapse !== lastCollapse.current) {
      lastCollapse.current = collapse;
      setOpen(false);
    }
  }, [collapse]);

  const compare = useCallback((a: TreeObj, b: TreeObj) => {
    // Folder first
    if (a.isLeaf !== b.isLeaf) {
      return a.isLeaf ? 1 : -1;
    }

    // If file, sort by created date
    if (a.isLeaf) {
      const createdA = a.createdDate ? new Date(a.createdDate).getTime() : 0;
      const createdB = b.createdDate ? new Date(b.createdDate).getTime() : 0;
      return createdA - createdB;
    }

    // If folder, sort by name string
    return a.name.localeCompare(b.name);
  }, []);

  const SubTree = useMemo(() => {
    return Object.values(children)
      .sort(compare)
      .map((node) => {
        const newDepth = depth + 1;
        let isOpen = false;

        if (newDepth <= 1) {
          isOpen = true;
        }

        return (
          <React.Fragment key={node.name}>
            <TreeItem tree={node} depth={depth + 1} isOpen={isOpen} />
          </React.Fragment>
        );
      });
  }, [compare, children]);

  const nodeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    setOpen(!open);
  };

  let treeContent = null;

  if (isLeaf) {
    treeContent = (
      <Leaf name={name} path={path} isPublish={isPublish || false} />
    );
  } else if (isTop) {
    treeContent = <TopFolder name={name} count={count} />;
  } else {
    treeContent = (
      <Folder name={name} count={count} open={open} nodeClick={nodeClick} />
    );
  }

  return (
    <div className={cn("flex flex-col gap-0.5 mb-1.5 text-sm cursor-default")}>
      {treeContent}

      {!isLeaf && (
        <div
          className={cn(
            "ml-2",
            depth !== 1 &&
              `relative before:content-[''] before:h-full before:w-0.5 before:absolute before:top-0 before:left-0 
            before:bg-transparent group-hover:before:bg-secondary/50 before:translate-x-1.5`,
            open ? "block" : "hidden",
          )}
        >
          {SubTree}
        </div>
      )}
    </div>
  );
}
